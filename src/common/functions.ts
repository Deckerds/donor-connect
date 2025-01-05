export function downloadFile(blobData: Blob) {
  const blob = new Blob([blobData], { type: 'application/pdf' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'donation.pdf';

  link.click();

  URL.revokeObjectURL(link.href);
}
