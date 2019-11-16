import Field from './Field';

// Upon changing show metadata, please increment.
const METADATA_VERSION: number = 1;

/**
 * Defines all metadata to edit, render, and animate a Calchart show.
 */
export default class Show {
  metadataVersion: number;

  title: string;

  numDots: number;

  field: Field;

  constructor() {
    this.metadataVersion = METADATA_VERSION;
    this.numDots = 1;
    this.title = 'Example Show';
    this.field = new Field();
  }
}
