/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

function initializeComponents() {
  const style = document.createElement("style");
  style.innerHTML = `
    #json-editor {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    #json-editor-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 10px;
    }
    #json-editor-text {
      width: 400px;
      height: 300px;
    }
  `;
  document.head.appendChild(style);

  const jsonEditor = document.createElement("div");
  jsonEditor.id = "json-editor";
  const jsonEditorContent = document.createElement("div");
  jsonEditorContent.id = "json-editor-content";
  const jsonEditorText = document.createElement("textarea");
  jsonEditorText.id = "json-editor-text";
  const jsonEditorButton = document.createElement("button");
  jsonEditorButton.id = "json-editor-button";
  jsonEditorButton.textContent = "Edit JSON";
  const jsonEditorClose = document.createElement("button");
  jsonEditorClose.id = "json-editor-close";
  jsonEditorClose.textContent = "Close";
  const jsonEditorSave = document.createElement("button");
  jsonEditorSave.id = "json-editor-save";
  jsonEditorSave.textContent = "Save";
  jsonEditorContent.appendChild(jsonEditorText);
  jsonEditorContent.appendChild(jsonEditorSave);
  jsonEditorContent.appendChild(jsonEditorClose);
  jsonEditor.appendChild(jsonEditorContent);
  document.body.appendChild(jsonEditor);
  document.body.appendChild(jsonEditorButton);
}

export function hookupJsonEditor(document: Document, getJsonData: () => any, setJsonData: (arg0: any) => void) {
  initializeComponents();

  const jsonEditor = document.getElementById("json-editor");
  const jsonEditorButton = document.getElementById("json-editor-button");
  const jsonEditorClose = document.getElementById("json-editor-close");
  const jsonEditorSave = document.getElementById("json-editor-save");
  const jsonEditorText = document.getElementById("json-editor-text") as HTMLTextAreaElement;
  if (!jsonEditor || !jsonEditorButton || !jsonEditorClose || !jsonEditorSave || !jsonEditorText) {
    return;
  }
  jsonEditorButton.addEventListener("click", () => {
    jsonEditor.style.display = "block";
    jsonEditorText.value = JSON.stringify(getJsonData(), null, 2);
  });
  jsonEditorClose.addEventListener("click", () => {
    jsonEditor.style.display = "none";
  });
  jsonEditorSave.addEventListener("click", () => {
    try {
      const data = JSON.parse(jsonEditorText.value);
      setJsonData(data);
      jsonEditor.style.display = "none";
    }
    catch (e) {
      alert("Invalid JSON");
    }
  });
}
