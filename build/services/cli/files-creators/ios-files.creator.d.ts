import IFileRepository from '../../../infrastructure/repository/file-repository.types';
export default class IosFilesCreator implements IFilesCreator {
    private fileRepository;
    private supportedExtension;
    private defaultFileName;
    constructor(fileRepository: IFileRepository);
    supports(extension: string): boolean;
    save(dataToSave: Array<{
        lang: string;
        content: string;
    }> | string, path: string, filename: string, baseLang: string): void;
    private transformLangWithRegion;
    private createFolderAndSave;
    private generateBaseTranslations;
}
