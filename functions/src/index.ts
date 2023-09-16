import {onCall, HttpsError} from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineString } from 'firebase-functions/params';
import { google } from 'googleapis';

const querySheetInfo = async function (id: string, apiKey: string) {
  logger.info('querySheetInfo()', id, '<hidden-api-key>');
  const response = await google.sheets('v4').spreadsheets.get({
    spreadsheetId: id,
    key: apiKey
  });
  if (response.status !== 200 || !response.data) {
      logger.error('Failed to fetch sheet info for sheet:', id, 'response:', response);
      throw new Error('Failed to fetch sheet info');
  }
  return response.data;
};

const querySubsheetData = async function (id: string, subsheetName: string, apiKey: string) {
  logger.info('querySubsheetData()', id, subsheetName, '<hidden-api-key>');
  const response = await google.sheets('v4').spreadsheets.values.get({
    spreadsheetId: id,
    range: subsheetName,
    key: apiKey
  });
  if (response.status !== 200 || !response.data.values) {
      logger.error('Failed to fetch subsheet data for sheet:', id, 'subsheet:', subsheetName, 'response:', response);
      throw new Error('Failed to fetch subsheet data');
  }
  return response.data.values;
};

const getSubsheetNames = async function (id: string, apiKey: string) {
  logger.info('getSubsheetNames()', id, '<hidden-api-key>');
  const sheetInfo = await querySheetInfo(id, apiKey);
  const sheets = sheetInfo.sheets || [];
  if (sheets.length == 0) {
    logger.error('No subsheets found for sheet:', id);
  }
  const sheetNames: string[] = [];
  sheets.forEach((sheet, index) => {
    const props = sheet.properties;
    if (props === undefined) {
      logger.error('Properties not found on subsheet', index, 'of', id, 'sheet info:', sheet);
    } else {
      const title = props.title;
      if (title === null || title === undefined) {
        logger.error('Subsheet', index, 'title null or undefined on sheet', id, 'props:', props);
      } else {
        sheetNames.push(title);
      }
    }
  });
  return sheetNames;
};

const getSheetContent = async function (id: string, subsheetName: string, apiKey: string) {
  logger.info('getSheetContent()', id, subsheetName, '<hidden-api-key>');
  const data = await querySubsheetData(id, subsheetName, apiKey);
  return data; // TODO kmere Process a bit
};

const getAllSheetContent = async function (id: string, apiKey: string) {
  logger.info('getAllSheetContent()', id, '<hidden-api-key>');
  const subsheetNames = await getSubsheetNames(id, apiKey);
  const subsheetContents = subsheetNames.map(async name => ({
    name: name,
    data: await getSheetContent(id, name, apiKey)
  }));
  return Promise.all(subsheetContents);
};

export const getAllSheetData = onCall(async () => {
  logger.info('getAllSheetData()');
  const spreadsheetId = defineString('SPREADSHEET_ID').value();
  const key = defineString('SHEETS_API_KEY').value();

  try {
    return await getAllSheetContent(spreadsheetId, key);
  } catch (error: any) {
    console.error('Caught: ', error);
    throw new HttpsError('internal', 'Failed to retrieve data');
  }
});
