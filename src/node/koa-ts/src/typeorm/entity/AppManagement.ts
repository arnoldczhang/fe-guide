import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 't_app_management' })
export class AppManagement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    appName: string;

    @Column()
    appCategoryId: string;

    @Column()
    appDescription: string

    @Column()
    appPlatform: string

    @Column()
    appReleased: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;

    @Column({ type: 'json' })
    cdnConfig: any;
}
