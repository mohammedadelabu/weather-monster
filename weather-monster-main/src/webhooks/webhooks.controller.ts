import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateWebHookDto } from './dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webHookService: WebhooksService) {}
  @Post()
  createWebhook(@Body() dto: CreateWebHookDto) {
    return this.webHookService.createWebhook(dto);
  }
  @Delete(':id')
  deleteWebhook(@Param('id', ParseIntPipe) webhookId: number) {
    return this.webHookService.deleteWebhook(webhookId);
  }
}
