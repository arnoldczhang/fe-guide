import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: 't_daily_report'})
export class DailyReport {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    appName: string;

    @Column()
    categoryId: string;

    @Column("boolean", { default: false } )
    hasAccident: boolean

    @Column({type: 'timestamp'})
    beginDate: Date;

    @Column({type: 'timestamp'})
    endDate: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createTime: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateTime: Date;

    @Column({type: 'smallint', default: 0 })
    status: number;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    jsErrorResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    networkErrorResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    networkCountResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    networkPerfResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    jsapiErrorResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    jsapiPerfResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    pagePerfResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    pageCountResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    baseChangeResults: any;
}