import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { config } from '../../config/config';
import { FolderItemPM, ItemPM, ObjectPostMan } from '../models/postman.model';

@Injectable()
export class GeneratePostManCollectionService implements OnApplicationBootstrap {
  private arrayOfDto: unknown[] = [];
  private readonly arrayOfSpec: unknown[] = [];
  private collectionJson: ObjectPostMan = {
    info: {
      name: 'HomePage',
      description: 'HomePage API Postman collection.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [],
    variable: [
      {
        key: 'link',
        value: `http://localhost:${config().port}`,
        type: 'string',
      },
    ],
  };

  public async onApplicationBootstrap(): Promise<void> {
    this.generatePostManJsonCollectionFile(config().generatePostmanCollection);
  }

  // Analyse les fichiers .ts et récupère les informations nécessaires pour générer le fichier de collection Postman
  private generatePostManObject(filePaths: string[]): ObjectPostMan {
    this.getAllDto();
    this.getDescribeSpec();
    filePaths.forEach((filePath) => {
      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
      const obj: FolderItemPM = { name: '', item: [], description: undefined };

      const extractInfosTSFile = (node: ts.Node): void => {
        if (ts.isClassDeclaration(node) && node.name) {
          const className = node.name.text;
          let classDecoratorPath = '';

          const classDecorators = ts.getDecorators(node);
          if (classDecorators) {
            classDecorators.forEach((decorator) => {
              if (ts.isCallExpression(decorator.expression)) {
                const decoratorName = (decorator.expression.expression as ts.Identifier).text;
                if (decoratorName === 'Controller') {
                  classDecoratorPath = decorator.expression.arguments[0] ? (decorator.expression.arguments[0] as ts.StringLiteral).text : '';
                }
              }
            });
          }
          ts.forEachChild(node, (child) => {
            if (ts.isMethodDeclaration(child) && child.name) {
              const methodName = (child.name as ts.Identifier).text;
              let httpMethod = '';
              let path = '';
              let bodyContent: unknown | undefined = undefined;

              const decorators = ts.getDecorators(child);
              if (decorators) {
                decorators.forEach((decorator) => {
                  if (ts.isCallExpression(decorator.expression)) {
                    const decoratorName = (decorator.expression.expression as ts.Identifier).text;
                    if (['Get', 'Post', 'Put', 'Patch', 'Delete'].includes(decoratorName)) {
                      httpMethod = decoratorName.toUpperCase();
                      path = decorator.expression.arguments[0] ? (decorator.expression.arguments[0] as ts.StringLiteral).text : '';
                    }
                  }
                });
              }

              if (child.parameters) {
                child.parameters.forEach((param) => {
                  const paramDecorators = ts.getDecorators(param);
                  if (paramDecorators) {
                    paramDecorators.forEach((paramDecorator) => {
                      if (ts.isCallExpression(paramDecorator.expression)) {
                        const paramDecoratorName = (paramDecorator.expression.expression as ts.Identifier).text;
                        if (paramDecoratorName === 'Body') {
                          bodyContent = this.getTypesBodies(this.arrayOfDto, param.type.getText());
                        }
                      }
                    });
                  }
                });
              }

              if (httpMethod) {
                obj.name = className.replace('Controller', '');
                const descriptonObject = this.getTypesBodies(this.arrayOfSpec, obj.name);
                if (descriptonObject) {
                  obj.description = 'Description des routes : \n' + descriptonObject;
                }
                if (obj.name !== '') {
                  const pathAfterSplit: string[] | undefined = path.split('/')[0] != '' ? path.split('/') : undefined;
                  if (methodName === 'login') {
                    const item: ItemPM = {
                      name: methodName,
                      event: [
                        {
                          listen: 'test',
                          script: {
                            exec: [
                              '// Récupère les cookies de la réponse\r',
                              "var cookies = pm.response.headers.get('Set-Cookie');\r",
                              '\r',
                              '// Si le cookie contient "authorization" (ou tout autre nom que vous utilisez), on l\'extrait\r',
                              'if (cookies) {\r',
                              "    // Remplacez 'authorization' par le nom du cookie que vous attendez\r",
                              '    var authorizationCookie = cookies.match(/Authorization=([^;]+)/);\r',
                              '\r',
                              '    if (authorizationCookie) {\r',
                              '        // Stocke la valeur du cookie dans une variable Postman\r',
                              '        pm.collectionVariables.set("authorization", authorizationCookie[1]);\r',
                              '        console.log("Authorization cookie stored: " + pm.collectionVariables.get("authorization"));\r',
                              '    } else {\r',
                              '        console.log("Authorization cookie not found");\r',
                              '    }\r',
                              '}\r',
                              '',
                            ],
                            type: 'text/javascript',
                            packages: {},
                          },
                        },
                      ],
                      request: {
                        method: httpMethod,
                        header: [],
                        body: {
                          mode: 'raw',
                          raw: JSON.stringify({ email: 'admin@gmail.com', password: 'azerty' }, null, 2),
                          options: {
                            raw: {
                              language: 'json',
                            },
                          },
                        },
                        url: {
                          raw: `{{link}}${classDecoratorPath}${path ? '/' + path : ''}`,
                          host: ['{{link}}'],
                          path: pathAfterSplit ? [classDecoratorPath, ...pathAfterSplit] : [classDecoratorPath],
                        },
                      },
                    };
                    obj.item.push(item);
                  } else {
                    const item: ItemPM = {
                      name: methodName,
                      request: {
                        method: httpMethod,
                        header: [
                          {
                            key: 'Cookie',
                            value: 'Authorization={{authorization}}; Domain=localhost; Path=/; HttpOnly',
                            type: 'text',
                          },
                        ],
                        body: bodyContent
                          ? {
                              mode: 'raw',
                              raw: JSON.stringify(bodyContent, null, 2),
                              options: {
                                raw: {
                                  language: 'json',
                                },
                              },
                            }
                          : undefined,
                        url: {
                          raw: `{{link}}${classDecoratorPath}${path ? '/' + path : ''}`,
                          host: ['{{link}}'],
                          path: pathAfterSplit ? [classDecoratorPath, ...pathAfterSplit] : [classDecoratorPath],
                        },
                      },
                    };
                    obj.item.push(item);
                  }
                }
              }
            }
          });
        }
        ts.forEachChild(node, extractInfosTSFile);
      };

      extractInfosTSFile(sourceFile);
      this.collectionJson.item.push(obj);
    });
    return this.collectionJson;
  }

  // Récupère tous les chemins des fichiers d'un répertoire avec une extension donnée
  private getAllFilesPathsWithExtension(extension: string, dir: string = path.join(__dirname, '..', '..', '..')): string[] {
    let results: string[] = [];
    const contentDirectory = fs.readdirSync(dir);

    contentDirectory.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllFilesPathsWithExtension(extension, filePath));
      } else if (file.endsWith(extension)) {
        results.push(filePath);
      }
    });

    return results;
  }

  // Organise les items de l'objet de la structure de Postman
  private organizationOfItems(object: ObjectPostMan): ObjectPostMan {
    object.item = object.item.filter((elem) => elem.name !== '' || elem.item.length > 0);
    object.item.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return object;
  }

  // Génère le fichier de collection Postman
  public generatePostManJsonCollectionFile(activate: boolean = false): void {
    if (activate) {
      const filePaths: string[] = this.getAllFilesPathsWithExtension('.controller.ts');
      const ObjectPostMan: ObjectPostMan = this.generatePostManObject(filePaths);
      const object = this.organizationOfItems(ObjectPostMan);
      const objectJson = JSON.stringify(object, null, 2);
      const savePath = path.join(__dirname, '..', '..', '..', 'postman-collection', 'postman-collection.json');
      fs.writeFile(savePath, objectJson, 'utf-8', (err) => {
        if (err) {
          Logger.error(err);
        }
        Logger.log('Postman collection file generated !');
        this.collectionJson = {
          info: {
            name: 'HomePage',
            description: 'La collection de Paddock One.',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
          },
          item: [],
          variable: [
            {
              key: 'link',
              value: 'http://localhost:3500',
              type: 'string',
            },
          ],
        };
      });
    }
  }

  // Récupère les informations des fichiers .dto.ts
  private getAllDto(): void {
    this.arrayOfDto = [];
    this.getAllFilesPathsWithExtension('.dto.ts').forEach((filePath) => {
      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
      const interfaceDto: Record<string, unknown> = {};
      const extractInfosTSFile = (node: ts.Node): void => {
        if (ts.isClassDeclaration(node) && node.name) {
          const className = node.name.text;
          node.members.forEach((member) => {
            if (ts.isPropertyDeclaration(member) && member.name) {
              const name = member.name.getText();
              let type: string | null = null;
              let isOptional = false;

              if (member.type) {
                type = member.type.getText();
              }

              if (member.questionToken) {
                isOptional = true;
              }
              interfaceDto[name] = isOptional ? `${type} | undefined` : type;
            }
          });
          this.arrayOfDto.push({ [className]: interfaceDto });
        }

        ts.forEachChild(node, extractInfosTSFile);
      };

      extractInfosTSFile(sourceFile);
    });
  }

  // Récupère le contenu d'un type donné [ { type: value } ]
  private getTypesBodies(array: unknown[], typeName: string): unknown | undefined {
    const foundObject = (array as Record<string, unknown>[]).find((item) => item[typeName] !== undefined);
    return foundObject ? foundObject[typeName] : undefined;
  }

  // Récupère les informations des fichiers .controller.spec.ts
  private getDescribeSpec(): void {
    this.getAllFilesPathsWithExtension('.controller.spec.ts').forEach((filePath) => {
      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
      let obj = { describe: '', it: '' };
      let result: string = '';
      const findTestBlocks = (node: ts.Node): void => {
        if (ts.isCallExpression(node)) {
          const expression = node.expression;
          if (ts.isIdentifier(expression)) {
            const functionName = expression.text;
            if (functionName === 'describe' || functionName === 'it') {
              const firstArgument = node.arguments[0];
              if (ts.isStringLiteral(firstArgument)) {
                obj[functionName] = firstArgument.text;
                if (functionName === 'it') {
                  result += `La route ${obj.describe} ${obj.it}. `;
                  result += '\n';
                  obj = { describe: '', it: '' };
                }
              }
            }
          }
        }
        ts.forEachChild(node, (childNode) => findTestBlocks(childNode));
      };
      findTestBlocks(sourceFile);
      const resultObject = {};
      const nameResultObject = result.split(' ')[2].replace('Controller', '');
      resultObject[nameResultObject] = result.replace(`La route ${nameResultObject}Controller should be defined. \n`, '');
      this.arrayOfSpec.push(resultObject);
    });
  }
}
