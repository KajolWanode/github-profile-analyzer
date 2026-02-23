import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exports an HTML element to a multi-page PDF
 * Handles content that spans multiple pages by calculating page breaks
 * @param element - The DOM element to export
 * @param filename - The filename for the exported PDF
 * @returns Promise that resolves when PDF is saved
 */
export async function exportElementToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  if (!element) {
    throw new Error("Element not found");
  }

  try {
    // Convert the HTML element to a canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });

    // Get canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // PDF setup
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the aspect ratio and scaling
    // We want to fit the content to the PDF width
    const scaledWidth = pdfWidth;
    const scaledHeight = (canvasHeight * pdfWidth) / canvasWidth;

    // Calculate how many pages we need
    // Account for margins (10mm top and bottom)
    const contentHeightPerPage = pdfHeight - 10; // 10mm total margin
    const totalPages = Math.ceil(scaledHeight / contentHeightPerPage);

    // Create image data from canvas
    const imgData = canvas.toDataURL("image/png");

    // Add pages with portions of the image
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage("a4");
      }

      // Calculate the source area for this page
      const pageHeight = (canvasHeight * contentHeightPerPage) / scaledHeight;
      const sourceY = page * pageHeight;

      // Create a temporary canvas for this page portion
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvasWidth;
      pageCanvas.height = Math.min(pageHeight, canvasHeight - sourceY);

      const ctx = pageCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Create a temporary image for cropping
      const tempImg = new Image();
      tempImg.src = imgData;

      await new Promise<void>((resolve) => {
        tempImg.onload = () => {
          // Draw the portion of the image for this page
          ctx.drawImage(
            tempImg,
            0,
            sourceY,
            canvasWidth,
            pageCanvas.height,
            0,
            0,
            canvasWidth,
            pageCanvas.height
          );
          resolve();
        };
      });

      // Convert page canvas to image and add to PDF
      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 5, 5, scaledWidth - 10, contentHeightPerPage);
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Alternative approach: Adds multiple images in sequence without complex cropping
 * This simpler method may be more reliable for some use cases
 * @param element - The DOM element to export
 * @param filename - The filename for the exported PDF
 * @returns Promise that resolves when PDF is saved
 */
export async function exportElementToPDFSimple(
  element: HTMLElement,
  filename: string
): Promise<void> {
  if (!element) {
    throw new Error("Element not found");
  }

  try {
    // Convert the HTML element to a canvas with high quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaling to fit content to PDF width with margins
    const margin = 5; // 5mm margins
    const contentWidth = pdfWidth - 2 * margin;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    // Calculate number of pages needed
    const availableHeight = pdfHeight - 2 * margin;
    const totalPages = Math.ceil(contentHeight / availableHeight);

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");

    // For multi-page, we need to use a more direct approach
    // Calculate the height of canvas that fits on one PDF page
    const canvasHeightPerPage = (canvas.height * availableHeight) / contentHeight;

    // Add pages
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage("a4");
      }

      // Calculate vertical offset in the original canvas
      const sourceY = page * canvasHeightPerPage;
      const sourceHeight = Math.min(
        canvasHeightPerPage,
        canvas.height - sourceY
      );

      // Create a temporary canvas for this portion
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = sourceHeight;

      const ctx = tempCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Copy the portion from the main canvas
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      // Convert to image and add to PDF
      const pageImg = tempCanvas.toDataURL("image/png");
      const pageHeight = (sourceHeight * contentWidth) / canvas.width;

      pdf.addImage(pageImg, "PNG", margin, margin, contentWidth, pageHeight);
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
