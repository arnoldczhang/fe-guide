import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class DiffRecord {

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
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({type: 'smallint', default: 0 })
    status: number;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    jsResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    networkResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    jsapiResults: any;

    @Column("json", {nullable: false, default: ()=> "'{}'"})
    pagePrefResults: any;
}