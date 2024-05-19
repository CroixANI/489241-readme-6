import { Entity, StorableEntity, EmailNews } from '@project/shared-core';

export class EmailNewsEntity extends Entity implements StorableEntity<EmailNews> {
  public sentDate: Date;

  constructor (lastEmailNews?: EmailNews) {
    super();
    this.populate(lastEmailNews);
  }

  public populate(lastEmailNews?: EmailNews): void {
    if (! lastEmailNews) {
      return;
    }

    this.id = lastEmailNews.id ?? '';
    this.sentDate = lastEmailNews.sentDate;
  }

  public toPOJO(): EmailNews {
    return {
      id: this.id,
      sentDate: this.sentDate,
    }
  }
}
