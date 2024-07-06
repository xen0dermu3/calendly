import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CeoAgenda {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  startDateTime!: Date;

  @Column()
  endDateTime!: Date;

  @Column()
  duration!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
