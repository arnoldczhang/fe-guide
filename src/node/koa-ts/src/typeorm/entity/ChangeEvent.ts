import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: 't_change_event'})
export class ChangeEvent {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    appName: string;

    @Column({type: 'timestamp'})
    beginDate: Date;

    @Column({type: 'timestamp'})
    endDate: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;

    @Column("json", {nullable: false, default: ()=> "'[]'"})
    changeEvents: any;
}