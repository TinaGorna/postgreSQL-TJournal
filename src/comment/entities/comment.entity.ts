import {
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {JoinColumn} from "typeorm/browser";
import {UserEntity} from "../../user/entities/user.entity";
import {PostEntity} from "../../post/entities/post.entity";

@Entity("comments")
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, {
        nullable: false
    })
    @JoinColumn({name: "userId"})
    user: UserEntity;

    @ManyToOne(() => PostEntity, {
        nullable: false
    })
    @JoinColumn({name: "postId"})
    post: UserEntity;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

}