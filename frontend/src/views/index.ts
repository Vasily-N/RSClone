interface IView {
  append: () => void;
  replace: () => void;
  setParent: (parentId:string) => void;
}

abstract class View implements IView {
  private parentId:string;
  protected templateItems:Element[];

  private static initTemplateString(template:string, style:Record<string, string>):string {
    return Object.keys(style).reduce((r, s) => r.replace(new RegExp(`{{${s}}}`, 'g'), style[s]), template);
  }

  protected constructor(parentId:string, template:string, style:Record<string, string>) {
    this.parentId = parentId;
    this.templateItems = View.initTemplate(View.initTemplateString(template, style));
  }

  public setParent(parentId: string):void {
    this.parentId = parentId;
  }

  private static getParent(parentId:string):Element | undefined {
    return document.getElementById(parentId)
      || document.getElementsByClassName(parentId)[0]
      || document.getElementsByTagName(parentId)[0];
  }

  private getParent():Element | undefined {
    return View.getParent(this.parentId);
  }

  private static initTemplate(templateString:string):Element[] {
    const template:HTMLTemplateElement = document.createElement('template');
    template.innerHTML = templateString;
    return [...template.content.children];
  }

  protected static getElementById(elements:Element[], id:string):Element | undefined {
    let found = elements.find((el) => el.id === id);
    if (found) return found;
    for (let i = 0; i < elements.length; i += 1) {
      if (elements[i].children.length) {
        found = View.getElementById([...elements[i].children], id);
        if (found) return found;
      }
    }
    return undefined;
  }

  protected getElementById(id:string):Element | undefined {
    return View.getElementById(this.templateItems, id);
  }

  public replace():void {
    const parent = this.getParent();
    if (!parent) return;
    parent.innerHTML = '';
    this.append(parent);
  }

  public append(parent = this.getParent()):void {
    if (!parent) return;
    this.templateItems.forEach((v) => { parent.append(v); });
  }
}

export { View, IView };
