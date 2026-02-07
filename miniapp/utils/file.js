function fileToBase64DataUrl(filePath, mimeType = 'image/png') {
  const fs = wx.getFileSystemManager();
  return new Promise((resolve, reject) => {
    fs.readFile({
      filePath,
      encoding: 'base64',
      success: (res) => {
        resolve(`data:${mimeType};base64,${res.data}`);
      },
      fail: (err) => reject(err)
    });
  });
}

function detectMimeFromPath(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  if (lower.endsWith('.gif')) {
    return 'image/gif';
  }
  return 'image/png';
}

module.exports = {
  fileToBase64DataUrl,
  detectMimeFromPath
};
