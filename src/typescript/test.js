ts.updateSourceFileNode(
  ts.createSourceFile('temporary.ts', '', ts.ScriptTarget.Latest),
  [
    ts.createFunctionDeclaration(
      undefined,
      undefined,
      undefined,
      ts.createIdentifier('foo'),
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier('bar'),
          undefined,
          ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        )
      ],
      ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
      ts.createBlock(
        [
          ts.createReturn(
            ts.createBinary(
              ts.createIdentifier('bar'),
              ts.createToken(ts.SyntaxKind.PlusToken),
              ts.createNumericLiteral('1')
            )
          )
        ],
        true
      )
    )
  ]
)


