import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 't_lighthouse_task' })
export class LighthouseTask {
    @PrimaryColumn('varchar', {
        length: 255
    })
    id: string;

    @Column()
    appName: string;

    @Column()
    category: string;

    @Column()
    status: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;
}
