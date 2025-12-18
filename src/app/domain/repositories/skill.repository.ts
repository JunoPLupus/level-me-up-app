import {Observable} from 'rxjs';
import {Skill} from '../entities/skill.entity';

export abstract class SkillRepository {
  abstract getAll(userId: string): Observable<Skill[]>;
  abstract getById(skillId: string): Observable<Skill | undefined>;

  abstract create(skill: Skill): Promise<void>;
  abstract update(skill: Skill): Promise<void>;
  abstract delete(skillId: string): Promise<void>;
}
