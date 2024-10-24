import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisIoAdapter
  extends IoAdapter
  implements OnModuleInit, OnModuleDestroy
{
  private adapterConstructor: ReturnType<typeof createAdapter> | undefined;
  private pubClient: RedisClientType | undefined;
  private subClient: RedisClientType | undefined;

  async onModuleInit(): Promise<void> {
    await this.connectToRedis();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnectFromRedis();
  }

  async connectToRedis(): Promise<void> {
    try {
      this.pubClient = createClient({ url: 'redis://redis:6379' });
      this.subClient = this.pubClient.duplicate();

      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
      console.log(
        'Connected to Redis+++++++++++++++++++++++++++++++++++++++++++++',
      );

      this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw error;
    }
  }

  private async disconnectFromRedis(): Promise<void> {
    try {
      if (this.pubClient) await this.pubClient.quit();
      if (this.subClient) await this.subClient.quit();
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }

  createIOServer(port: number, options?: ServerOptions): any {
    if (!this.adapterConstructor) {
      throw new Error(
        'Redis adapter is not initialized. Call connectToRedis() before creating the server.',
      );
    }

    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }

  getPubClient(): RedisClientType {
    if (!this.pubClient) {
      throw new Error('PubClient is not initialized');
    }
    return this.pubClient;
  }

  getSubClient(): RedisClientType {
    if (!this.subClient) {
      throw new Error('SubClient is not initialized');
    }
    return this.subClient;
  }
  async getAllConnectedClients(): Promise<string[]> {
    return await this.getPubClient().sMembers('connected_clients');
  }
}
