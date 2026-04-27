import { Card } from 'src/card/entities/card.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'User ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Ahmad', description: 'First name' })
  @Column()
  first_name: string;

  @ApiProperty({ example: 'Ali', description: 'Last name' })
  @Column()
  last_name: string;

  @ApiProperty({ example: 'male', description: 'Gender' })
  @Column()
  gender: string;

  @ApiProperty({ example: '0933xxxxxx', description: 'Phone number' })
  @Column()
  phone: string;

  @ApiProperty({ example: '2023', description: 'University year' })
  @Column()
  year: string;

  @ApiProperty({ example: 'Software Engineering', description: 'Specialization' })
  @Column()
  specialization: string;

  @ApiProperty({ example: 'ahmad@example.com', description: 'Email address' })
  @Column({ unique: true })
  email: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', description: 'Email verification date' })
  @Column({ nullable: true })
  email_verified_at: Date;

  @ApiPropertyOptional({ example: 'hashedpassword123', description: 'Hashed password (hidden in responses)' })
  @Column({})
  password: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  @Column()
  role: string;

  @ApiPropertyOptional({ example: 'token123', description: 'Remember token' })
  @Column({ nullable: true })
  remember_token: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'User creation date' })
  @CreateDateColumn()
  created_at: Date = new Date();

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'User last update date' })
  @UpdateDateColumn()
  updated_at: Date = new Date();

  @ApiPropertyOptional({ type: () => Card, description: 'User card' })
  @OneToOne(() => Card, (card) => card.user)
  card: Card;
}
