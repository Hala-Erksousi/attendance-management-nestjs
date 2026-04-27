import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('cards')
export class Card {
    @ApiProperty({ example: 1, description: 'Card ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'CARD-001-2024', description: 'Unique card code' })
    @Column({ unique: true })
    code: string;

   @ApiPropertyOptional({ type: () => User, description: 'User that owns this card' })
   @OneToOne(() => User, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: User;

   @ApiProperty({ example: 1, description: 'User ID that owns this card' })
   @Column()
   user_id: number;

   @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Card creation date' })
   @CreateDateColumn()
   created_at: Date;

   @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Card last update date' })
   @UpdateDateColumn()
   updated_at: Date;
}
