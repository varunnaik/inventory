import {Entity, PrimaryGeneratedColumn, OneToMany, Column} from "typeorm";
import {Asset} from "./Asset";

@Entity()
export class ShoppingCentre {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @OneToMany((type: any) => Asset, (asset: Asset) => asset.shoppingcentre)
    assets: Asset[];

    @Column()
    created_at: number;

}
