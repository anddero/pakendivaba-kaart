import * as logger from 'firebase-functions/logger';
import { SheetsApi } from './apiSheets';

export namespace SheetsUsecase {

    export const getSubsheetNames = async function (id: string, apiKey: string) {
        logger.info('SheetsUsecase::getSubsheetNames()', id, '<hidden-api-key>');
        const sheetInfo = await SheetsApi.querySheetInfo(id, apiKey);
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

    export const getSheetContent = async function (id: string, subsheetName: string, apiKey: string) {
        logger.info('SheetsUsecase::getSheetContent()', id, subsheetName, '<hidden-api-key>');
        const data = await SheetsApi.querySubsheetData(id, subsheetName, apiKey);
        return data; // TODO kmere Process a bit // Continue from here and then resolve other TODOs
    };

    export const getAllSheetContent = async function (id: string, apiKey: string) {
        logger.info('SheetsUsecase::getAllSheetContent()', id, '<hidden-api-key>');
        const subsheetNames = await getSubsheetNames(id, apiKey);
        const subsheetContents = subsheetNames.map(async name => ({
            name: name,
            data: await getSheetContent(id, name, apiKey)
        }));
        return Promise.all(subsheetContents);
    };

}
