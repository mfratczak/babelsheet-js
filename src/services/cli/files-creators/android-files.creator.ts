import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class AndroidFilesCreator implements IFilesCreator {
  private supportedExtension = 'xml';
  private defaultFileName = 'strings';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(
    dataToSave: Array<{ lang: string; content: string }> | string,
    path: string,
    filename: string,
    baseLang: string
  ): void {
    if (typeof dataToSave === 'string') {
      this.createFolderAndSave(dataToSave, path, filename);
      return;
    }

    const dataWithoutTags = dataToSave.filter((translation: any) => translation.lang !== 'tags');
    dataWithoutTags.forEach((data: any) => {
      const langWithLocale = this.transformLangWithRegion(data.lang);
      const folderName = `${path}/values-${langWithLocale}`;

      this.createFolderAndSave(data.content, folderName);
    });

    this.generateBaseTranslations(dataToSave, path, baseLang);
  }

  private transformLangWithRegion(languageCode: string): string {
    const langWithLocale = languageCode.split(/[-_]{1}/);

    if (langWithLocale.length > 1) {
      if (langWithLocale[0].toLocaleLowerCase() === langWithLocale[1].toLocaleLowerCase()) {
        return langWithLocale[0].toLowerCase();
      }
      return langWithLocale.join('-r');
    }

    return languageCode;
  }

  private createFolderAndSave(data: string, folderName: string, filename?: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    this.fileRepository.saveData(data, filename || this.defaultFileName, this.supportedExtension, folderName);
  }

  private generateBaseTranslations(
    dataToSave: Array<{ lang: string; content: string }>,
    path: string,
    baseLang: string
  ) {
    const baseTranslations: any = dataToSave.find(
      (translation: any) => translation.lang.toLowerCase().indexOf(baseLang.toLowerCase()) !== -1
    );

    if (baseTranslations) {
      const folderName = `${path}/values`;

      this.createFolderAndSave(baseTranslations.content, folderName);
    }
  }
}
