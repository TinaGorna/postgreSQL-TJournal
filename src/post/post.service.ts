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
            qb.where(`p.body ILIKE %${dto.body}%`);
        }

        if (dto.title) {
            qb.where(`p.title ILIKE %${dto.title}%`);
        }

        if (dto.tag) {
            qb.where(`p.title ILIKE %${dto.tag}%`);
        }

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

    async findOne(id: number) { //TODO проверить правильность работы {where: {id}}
        const find = await this.repository.findOne({where: {id}});

        if (!find) {
            throw new NotFoundException("Post is not found")
        }
        return find; //здесь не делаем второй запрос, а получаем то, что есть
    }

    async update(id: number, dto: UpdatePostDto) { //TODO проверить правильность работы {where: {id}}
        const find = await this.repository.findOne({where: {id}});

        if (!find) {
            throw new NotFoundException("Post is not found")
        }
        return this.repository.update(id, dto); //верхний и нижний код - два разных запроса
    }

    async remove(id: number) {
        const find = await this.repository.find({where: {id}})
        if (!find) {
            throw new NotFoundException("Post is not found")
        }
        return this.repository.delete(id);
    }
}
