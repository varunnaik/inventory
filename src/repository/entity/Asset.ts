import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm";
import {ShoppingCentre} from "./ShoppingCentre"

@Entity()
export class Asset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    active: boolean;

    @Column()
    name: string;

    @Column("json")
    dimensions: any;

    @Column("json")
    location: any;

    @Column()
    status: string;

    @ManyToOne((type: any) => ShoppingCentre, (shoppingcentre: ShoppingCentre) => shoppingcentre.assets)
    shoppingcentre: ShoppingCentre;

    @Column()
    created_at: number;

}