import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_account', { schema: 'public' })
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying', { unique: true })
  email: string;

  @Column('character varying', { length: 60 })
  password: string;

  @Column('character varying')
  photo: string;

  @Column('character varying', { nullable: true })
  verification_code: string;

  @Column('timestamp without time zone', { nullable: true })
  verification_date: Date | null;

  @Column('timestamp without time zone', { default: 'NOW()' })
  created_at: Date;
}
