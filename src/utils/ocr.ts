// eslint-disable-next-line import/no-extraneous-dependencies
import Tesseract from 'tesseract.js';

export function readImageAsText(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const imageURL = URL.createObjectURL(file);
  
  
  
  return new Promise((resolve, reject) => {
    Tesseract.recognize(imageURL, 'heb', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress);
        }
      },
    })
    .then(({ data }) => {
        console.log({ data });
        URL.revokeObjectURL(imageURL);
        resolve(data.text);
      })
      .catch(reject);
  });
}
