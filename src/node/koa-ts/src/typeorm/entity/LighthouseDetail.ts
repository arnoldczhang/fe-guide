import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 't_lighthouse_details' })
export class LighthouseDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  jobId: string;

  @Column()
  taskId: string;

  @Column({ type: 'timestamp' })
  startTimestamp: Date;

  @Column({ type: 'timestamp' })
  endTimestamp: Date;

  @Column({ type: 'timestamp' })
  eventTimestamp: Date;

  @Column()
  timeDay: string;

  @Column({ type: 'int' })
  pv: number;

  @Column({ type: 'int' })
  score: number;

  @Column()
  pagePath: string;

  @Column()
  status: string;

  @Column({ type: 'int' })
  millisecond: number;

  @Column()
  appName: string;

  @Column()
  categoryId: string;

  @Column()
  userAgent: string;

  @Column('json', { nullable: false, default: () => "'{}'" })
  environment: string;

  @Column()
  lighthouseVersion: string;

  @Column()
  fetchTime: string;

  @Column()
  requestedUrl: string;

  @Column()
  finalUrl: string;

  @Column()
  runWarnings: string;

  @Column()
  runtimeError: string;

  @Column('json', { nullable: false, default: () => "'{}'" })
  audits: any;

  @Column('json', { nullable: false, default: () => "'{}'" })
  configSettings: any;

  @Column('json', { nullable: false, default: () => "'{}'" })
  categories: any;

  @Column('json', { nullable: false, default: () => "'{}'" })
  categoryGroups: any;

  @Column('json', { nullable: false, default: () => "'{}'" })
  timing: any;

  @Column('json', { nullable: false, default: () => "'{}'" })
  i18n: any;

  @Column()
  stackPacks: string;
}
