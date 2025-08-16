import { Module } from '@nestjs/common';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { ScriptController } from './controllers/script.controller';
import { ScriptService } from './services/script.service';

@Module({
  imports: [],
  controllers: [ProjectController, ScriptController],
  providers: [ProjectService, ScriptService],
})
export class AppModule {}
