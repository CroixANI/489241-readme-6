import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EmailNews } from '@project/shared-core';

@Schema({
  collection: 'email-news',
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class EmailNewsModel extends Document implements EmailNews {
  @Prop({
    required: true,
  })
  public sentDate: Date;

  public id?: string;
}

export const EmailNewsSchema = SchemaFactory.createForClass(EmailNewsModel);

EmailNewsSchema.virtual('id').get(function() {
  return this._id.toString();
});
