/* 最初に一度だけ実行してscriptPropertiesにGitHubのアクセストークンを保存する */
// function setup() {
//   const scriptProperties = PropertiesService.getScriptProperties();
//   scriptProperties.setProperty('GITHUB_TOKEN', '<GitHubのアクセストークン>')
// }

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Custom Menu")
    .addItem(
      "Convert to TSV and push to GitHub",
      "createNewBranchPushAndCreatePullRequest"
    )
    .addToUi();
}

function createNewBranchPushAndCreatePullRequest() {
  // GitHub Personal access token
  const GITHUB_TOKEN =
    PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");

  // リポジトリのオーナー名とリポジトリ名、ターゲットとなるファイルパスを指定
  const repoOwner = "alfnets";
  const repoName = "test_gas_push";
  const fileName = "test_gas_push";
  const filePath = `src/${fileName}.tsv`;

  const sheet = SpreadsheetApp.getActiveSheet();
  const sheetAsCSV = convertToTSV(sheet.getDataRange().getValues());

  // create a new branch
  const newBranchName = `update_${fileName}_${new Date().getTime()}`;
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/main`;
  const mainBranch = JSON.parse(
    UrlFetchApp.fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }).getContentText()
  );

  UrlFetchApp.fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      contentType: "application/json",
      payload: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: mainBranch.object.sha,
      }),
    }
  );

  // commit and push to new branch
  const commitMessage = `Update ${fileName} in ${new Date().toLocaleDateString()}`;
  const content = JSON.parse(
    UrlFetchApp.fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    ).getContentText()
  );

  UrlFetchApp.fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
    {
      method: "put",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({
        message: commitMessage,
        content: Utilities.base64Encode(sheetAsCSV),
        branch: newBranchName,
        sha: content.sha,
      }),
    }
  );

  // create pull request
  const pullRequestTitle = `Update ${fileName}`;
  const pullRequestBody = `Please review the changes made to the ${fileName} sheet.`;
  UrlFetchApp.fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/pulls`,
    {
      method: "post",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      contentType: "application/json",
      payload: JSON.stringify({
        title: pullRequestTitle,
        body: pullRequestBody,
        head: newBranchName,
        base: "main",
      }),
    }
  );
}

function convertToTSV(values) {
  return values.map((row) => row.join("\t")).join("\n");
}
