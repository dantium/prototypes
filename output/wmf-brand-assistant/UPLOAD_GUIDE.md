# WMF Brand Assistant - upload guide

This package is portable knowledge, not an executable plugin. Install it by creating a persistent project or custom assistant and uploading the included files.

## ChatGPT Project - easiest option

1. In ChatGPT, select **New project** in the sidebar and name it **WMF Brand Assistant**.
2. Open the project's menu, select **Project settings**, and paste the full contents of `PROJECT_INSTRUCTIONS.txt` into Project instructions.
3. Add these four project sources:
   - `knowledge/wmf-brand-guide.md`
   - `knowledge/wmf-brand-rules.json`
   - `knowledge/wmf-qa-checks.yaml`
   - `WMF_Visual_Reference_Book.pdf`
4. Keep the files in `visuals/` available. Attach the relevant PNG to a chat whenever exact colour, background, composition, or lighting matching matters.
5. Start with: `Use the WMF visual references to generate a premium Function 4 product image from the attached product asset.`

ChatGPT Projects support uploaded reference files, images, project instructions, memory, and image generation. Project file limits depend on the plan. Official guide: https://help.openai.com/en/articles/10169521-projects-in-chatgpt

## Custom GPT - most plugin-like ChatGPT option

1. On the ChatGPT web app, open the GPTs area and create a new GPT.
2. Name it **WMF Brand Assistant** and paste `PROJECT_INSTRUCTIONS.txt` into Instructions.
3. Upload the four knowledge files listed above. You can additionally upload all four PNG files in `visuals/`.
4. Enable the image-generation capability.
5. Add conversation starters such as:
   - `Create a WMF product-image prompt using the approved background.`
   - `Edit this cookware image while preserving product geometry.`
   - `Review this banner against the WMF visual do and don't examples.`
6. Test the GPT in Preview with an actual product image before sharing it.

Creating and editing GPTs is available on the web to eligible paid users. Official guide: https://help.openai.com/en/articles/8554397-creating-a-gpt

## Claude Project

1. In Claude, open **Projects** and select **New Project**.
2. Name it **WMF Brand Assistant**.
3. Select **Set project instructions** and paste the full contents of `PROJECT_INSTRUCTIONS.txt`.
4. Add these files to Project knowledge:
   - `knowledge/wmf-brand-guide.md`
   - `knowledge/wmf-brand-rules.json`
   - `knowledge/wmf-qa-checks.yaml`
   - `WMF_Visual_Reference_Book.pdf`
5. Use the PDF as the persistent visual guide. Attach a raw PNG from `visuals/` directly to the relevant conversation when you need close image-to-image matching.
6. Start with: `Use the uploaded WMF visual guide to write an image-editing prompt for the attached product photo.`

Claude Projects are available on paid Claude plans. Their project knowledge accepts documents and project instructions; supported Claude models can visually analyse PDFs under 100 pages. Official guides:

- https://support.anthropic.com/en/articles/9519177-how-can-i-create-and-manage-projects
- https://support.anthropic.com/en/articles/8241126-what-kinds-of-documents-can-i-upload-to-claude-ai

## Updating the pack

When the WMF brand book or approved imagery changes, replace the relevant knowledge or visual files, rebuild the visual reference PDF, and re-upload the changed files to each platform. Treat the latest approved source as authoritative.
