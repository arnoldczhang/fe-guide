import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 't_minicode_build' })
export class MinicodeBuild {
    @PrimaryColumn('varchar', {
        length: 255
    })
    id: string;

    @Column()
    appName: string;

    @Column('varchar')
    appVersion: string;

    @Column('varchar')
    branch: string

    @Column('varchar')
    commitId: string

    @Column()
    // 是否线上版本,1 线上
    isOnline: number;

    @Column()
    status: number

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    buildResult: any

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;
}
