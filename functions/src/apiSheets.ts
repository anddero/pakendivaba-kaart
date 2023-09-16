import * as logger from 'firebase-functions/logger';
import { google } from 'googleapis';

export namespace SheetsApi {

    export const querySheetInfo = async function (id: string, apiKey: string) {
        logger.info('SheetsApi::querySheetInfo()', id, '<hidden-api-key>');
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

    export const querySubsheetData = async function (id: string, subsheetName: string, apiKey: string) {
        logger.info('SheetsApi::querySubsheetData()', id, subsheetName, '<hidden-api-key>');
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

}
