import Show from '../Show';

/**
 * Interface for building up the various Parsers we need for parsing CalChart Show files.
 * If the show cannot be parsed, throw an error that can be displayed to the user.
 * 
 * @param buffer     the Buffer to parse
 * @returns The parsed show
 */
export interface ParseCalChart {
  ParseShow(buffer : ArrayBuffer): Show;
}
