import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let existingCityId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    //get existing prisma service instance from app
    prismaService = await app.get(PrismaService);
    prismaService.clearDatabase();
  });
  let city = {
    name: 'sample city',
    latitude: 53.433,
    longitude: 14.6834,
  };

  describe('Cities', () => {
    it('should create city', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .send(city)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const { id, name, longitude, latitude } = res.body;
          existingCityId = id;
          expect(typeof id).toBe('number');
          expect(name).toBe(city.name);
          expect(longitude).toBe(city.longitude);
          expect(latitude).toBe(city.latitude);
        });
    });
    it('should not create city if city name already exist', () => {
      return request(app.getHttpServer())
        .post('/cities')
        .send(city)
        .expect(HttpStatus.FORBIDDEN);
    });
    it('should update city', () => {
      const updateInfo = {
        name: 'Updated name',
        latitude: 30.2231,
        longitude: 11.2323,
      };
      // update city
      city = { ...updateInfo };
      return request(app.getHttpServer())
        .patch(`/cities/${existingCityId}`)
        .send(updateInfo)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { id, name, longitude, latitude } = res.body;
          expect(typeof id).toBe('number');
          expect(name).toBe(updateInfo.name);
          expect(longitude).toBe(updateInfo.longitude);
          expect(latitude).toBe(updateInfo.latitude);
        });
    });
    it('should delete city', () => {
      return request(app.getHttpServer())
        .delete(`/cities/${existingCityId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { id, name, longitude, latitude } = res.body;
          expect(typeof id).toBe('number');
          expect(name).toBe(city.name);
          expect(longitude).toBe(city.longitude);
          expect(latitude).toBe(city.latitude);
        });
    });
  });

  describe('Temperatures', () => {
    it('should create temperature with current timestamp', () => {
      const tempData = { city_id: existingCityId, max: 50, min: 23 };
      return request(app.getHttpServer())
        .post(`/temperatures`)
        .send(tempData)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const { id, city_id, max, min } = res.body;
          expect(typeof id).toBe('number');
          expect(city_id).toBe(tempData.city_id);
          expect(max).toBe(tempData.max);
          expect(min).toBe(tempData.min);
        });
    });
  });

  describe('Forecasts', () => {
    it('should be able to get forecasts', async () => {
      //create city
      const createdCity = await prismaService.city.create({ data: city });
      const existingCityId = createdCity.id;
      const temperatures = [
        { city_id: existingCityId, max: 50, min: 23 },
        { city_id: existingCityId, max: 32, min: 24 },
        { city_id: existingCityId, max: 31, min: 23 },
      ];
      const { avgMax, avgMin } = temperatures.reduce(
        (acc, tempObj, index) => {
          acc.avgMax += tempObj.max;
          acc.avgMin += tempObj.min;
          if (index === temperatures.length - 1) {
            acc.avgMax /= temperatures.length;
            acc.avgMin /= temperatures.length;
            return acc;
          }
          return acc;
        },
        {
          avgMax: 0,
          avgMin: 0,
        },
      );

      //create temperatures
      await prismaService.temperature.createMany({
        data: temperatures,
      });

      return request(app.getHttpServer())
        .get(`/forecasts/${existingCityId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { city_id, max, min, sample } = res.body;
          expect(city_id).toBe(existingCityId);
          expect(Math.round(max)).toBe(Math.round(avgMax));
          expect(Math.round(min)).toBe(Math.round(avgMin));
          expect(sample).toBe(temperatures.length);
        });
    });
  });

  describe('WebHooks', () => {
    let webHookId;
    const callback_url = 'http://localhost/callback';
    it('should be able to create webhook', async () => {
      const webHookData = {
        city_id: existingCityId,
        callback_url,
      };
      return request(app.getHttpServer())
        .post(`/webhooks`)
        .send(webHookData)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const { city_id, callback_url, id } = res.body;
          webHookId = id;
          expect(city_id).toBe(webHookData.city_id);
          expect(callback_url).toBe(webHookData.callback_url);
        });
    });
    it('should be able to delete webhooks', () => {
      return request(app.getHttpServer())
        .delete(`/webhooks/${webHookId}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { city_id, callback_url, id } = res.body;
          webHookId = id;
          expect(city_id).toBe(existingCityId);
          expect(callback_url).toBe(callback_url);
        });
    });
  });
});
