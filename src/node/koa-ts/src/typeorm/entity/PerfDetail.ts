import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 't_perf_detail' })
export class PerfDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    testName: string;

    @Column()
    isDelete: boolean;

    @Column()
    fileUrl: string;

    @Column()
    branchName: string

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;

    @Column()
    commitId: string;

    @Column()
    authorName: string;

    @Column()
    batchId: string;
}
