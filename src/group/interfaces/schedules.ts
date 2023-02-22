import { Days } from '../../common/interfaces/days';

//  /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
/* TODO:VALIDAR HOUR CON REGEX */

export interface Schedules {
  day: Days;
  hour: string;
}
