const supportedLanguages = ['zh-CN', 'zh-TW']

const language = navigator.language

if (supportedLanguages.includes(language)) start(language)

async function start(language: string) {
  const tr = (await fetch(`/localization/${language}.json`).then((resp) =>
    resp.json()
  )) as Record<string, string>
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      vcc_auto_translate(mutation.target as HTMLElement, tr)
    })
  })
  observer.observe(document.querySelector('body')!, {
    childList: true,
    subtree: true,
  })
}

function vcc_auto_translate(node: HTMLElement, tr: Record<string, string>) {
  const selectors = [
    '.fui-Button',
    '.fui-Title1, .fui-Title3, .fui-Subtitle1, .fui-Subtitle2',
    '.fui-MenuList .fui-MenuItem, .fui-Option, .fui-OptionGroup__label',
    '.fui-Label, .fui-Caption1, .fui-Body1',
    '.fui-Tab>.fui-Tab__content, .fui-DataGridHeaderCell__button, .fui-TableHeaderCell__button',
    '.fui-TableCell',
    '.list-disc>li',
    '.fui-Alert',
    '.fui-DataGridHeaderCell__button',
    '.fui-DialogBody,p',
    '.fui-Checkbox > .fui-Label',
    '.fui-DialogTitle',
    '.fui-DialogContent',
    '.list-disc>li',
    '.fui-Caption1',
    '.fui-CardHeader>.fui-CardHeader__header>.fui-Body1',
    '.fui-CardFooter>.fui-Caption1',
    '.fui-Tooltip__content',
  ]
  selectors.forEach((selector) => {
    node.querySelectorAll(selector).forEach((e) => {
      e.childNodes.forEach((child) => {
        const text = child.textContent
        if (text && tr[text]) {
          if (
            text === 'New Project' &&
            (child as HTMLElement).classList &&
            !(child as HTMLElement).classList.contains('fui-Title1')
          )
            return
          child.textContent = tr[text]
          if (text === 'Projects')
            (e as HTMLElement).style.whiteSpace = 'nowrap'
        }
      })
    })
  })
  node.querySelectorAll('[placeholder]').forEach((e) => {
    const text = e.getAttribute('placeholder')
    if (text && tr[text]) e.setAttribute('placeholder', tr[text])
  })
}
