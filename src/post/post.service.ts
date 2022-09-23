import {Injectable, NotFoundException} from "@nestjs/common";
import {CreatePostDto} from "./dto/create-post.dto";
import {UpdatePostDto} from "./dto/update-post.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity";
import {SearchPostDto} from "./dto/search-post.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private repository: Repository<PostEntity>
    ) {
    }

    create(dto: CreatePostDto) {
        return this.repository.save(dto);
    }

    findAll() {
        return this.repository.find({ //возвращаем новые статьи первыми в списке
            order: {
                createdAt: "DESC"
            }
        });
    }

    async search(dto: SearchPostDto) {
        const qb = this.repository.createQueryBuilder();

        qb.limit(dto.limit || 0);
        qb.take(dto.take || 10);

        if (dto.views) {
            qb.orderBy("views", dto.views);
        }

        if (dto.body) {
            qb.andWhere(`p.body ILIKE :body`);
        }

        if (dto.title) {
            qb.andWhere(`p.title ILIKE :title`);
        }

        if (dto.tag) {
            qb.andWhere(`p.title ILIKE :tag`);
        }

        qb.setParameters({
            title: `%${dto.title}%`,
            body: `%${dto.body}%`,
            tag: `%${dto.tag}%`,
            views: dto.views || "DESC",
        })

        const [items, total] = await qb.getManyAndCount();
        return {items, total};
    }

    popular() {
        return this.repository.find({ //query Builder
            order: {
                views: "DESC"
            }
        });
    }

    async findOne(id: number) {
        await this.repository
            .createQueryBuilder("posts")
            .whereInIds(id)
            .update()
            .set({
                views: () => "views + 1",
            })
            .execute()

        return this.repository.findOne(id);
    }

    async update(id: number, dto: UpdatePostDto) {
        const find = await this.repository.findOne(+id)

        if (!find) {
            throw new NotFoundException("Post is not found")
        }
        return this.repository.update(id, dto); //верхний и нижний код - два разных запроса
    }

    async remove(id: number) {
        const find = await this.repository.find(+id)
        if (!find) {
            throw new NotFoundException("Post is not found")
        }
        return this.repository.delete(id);
    }
}
