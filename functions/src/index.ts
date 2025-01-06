import {onCall, HttpsError} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineString } from 'firebase-functions/params';
import { SheetsUsecase } from './usecaseSheets';

export const getAllSheetData = onCall(async () => {
  logger.info('getAllSheetData()');
  // TODO Make sure the api keys never reach end users
  // TODO Check what happens in case of different failures in frontend
  const spreadsheetId = defineString('SPREADSHEET_ID').value();
  const key = defineString('SHEETS_API_KEY').value();

  try {
    return await SheetsUsecase.getAllSheetContent(spreadsheetId, key);
  } catch (error: any) {
    console.error('Caught: ', error);
    throw new HttpsError('internal', 'Failed to retrieve data');
  }
});
