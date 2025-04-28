---
title: ChatGPT_スキーマ逆推定2
source: https://chatgpt.com/c/67cdd812-c658-8010-a194-34c557b07e9c
author: 
published: 
created: 2025-03-10
description: ChatGPT helps you get answers, find inspiration and be more productive. It is free to use and easy to try. Just ask and ChatGPT can help with writing, learning, brainstorming and more.
tags:
  - clippings
  - 卒業研究
---
了解しました。リレーショナルデータベースのSQL問い合わせ文を対象に、すべての種類のクエリ（SELECT, JOIN, GROUP BY, INSERT, UPDATE, DELETEなど）を解析し、データベーススキーマを推定する研究を進めるということですね。

さらに、機械学習（特に自然言語処理的なアプローチ）を活用し、カラム名やテーブル名の情報からスキーマを推測する手法を組み込みたいとのこと。

関連する先行研究や類似研究として、以下の分野を中心に文献を調査します。

- データベースリバースエンジニアリング（DBRE）
- SQLクエリ解析によるスキーマ推定
- 機械学習を用いたスキーマ推定（特に自然言語処理を活用したアプローチ）

調査が完了次第、結果を共有します。少々お待ちください。

# データベースリバースエンジニアリング（DBRE）

**データベースリバースエンジニアリング**（DBRE）は、既存のリレーショナルデータベースから概念スキーマ（ER図など）を再構築する研究分野です。古くから多くの手法が提案されており、それぞれ入力情報や前提条件が異なります​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=It%20is%20important%20to%20note,naming%20conventions%20are%20examples%20of)

​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Keeping%20in%20view%20the%20importance,be%20an%20ER%2C%20EER%20or)

。一般に、テーブル定義（DDL）やデータ、キー制約といった情報を解析し、エンティティやリレーションシップを推定します。代表的な研究例を以下に示します。

- **Premerlani & Blaha (1993, WCRE; 1994, CACM)** – PremerlaniとBlahaは、初期の包括的DBRE手法を提案しました​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=37,183%2C%20%281997)

​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=38,1994)

。関係データベースからオブジェクト指向モデル（OMTモデル）の概念スキーマを抽出するアプローチであり、実データベースを対象に手順を定義しています。**「An Approach for Reverse Engineering of Relational Databases」**​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=37,183%2C%20%281997)

では、リレーションスキーマとデータ内容を入力とし、正規化やキー情報を手がかりにE-R図を再構成しています。この研究は概念スキーマ再構築の基礎を築き、後続の多くのDBRE研究に影響を与えました。
- **Chiang, Barron & Storey (1994, *Data & Knowledge Engineering*)** – Chiangらは知識ベースシステムを用いたDBRE手法を開発しました​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Cummings%2C%20%281992%29%205,1995)

。**「Reverse engineering of relational databases: Extraction of an EER model from a relational database」**​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Cummings%2C%20%281992%29%205,1995)

にて、リレーショナルスキーマと主キー・包含従属（IND）などを入力とし、拡張ERモデル(EER)を自動生成するアルゴリズムを提案しています。リレーションが第三正規形(3NF)であることや属性名の一貫性といった前提のもと、属性間の包含関係から弱いエンティティや多重度を推定します​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Chiang%20et%20al,are%20consistent%3B%20following%20some%20convention)

。評価では、中規模の既存データベースを用いて手法の適用可能性を示し、生成されたEERモデルが妥当であることを確認しています。
- **Andersson (1994, ER国際会議)** – Anderssonはアプリケーションから抽出したSQL**データ操作文**(DML)とDDLスキーマを組み合わせてERC+モデル（拡張ERモデル）を復元する手法を提案しました​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Andersson%E2%80%99s%20Method%3A%20Author%20has%20proposed,apply%20the%20transformation%20rules%20to)

​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=3,419%2C%20%281994)

。**「Extracting an Entity-Relationship schema from a relational database through reverse engineering」**​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=3,419%2C%20%281994)

において、テーブル定義に加えプログラム中の`SELECT`や`JOIN`など**動的クエリ**の解析を行い、従来は推定が難しい弱エンティティや複合オブジェクト、カーディナリティの情報まで含む概念モデルを再構築しています。著者は実際の業務システムに本手法を適用し、実用上有効であることを検証しています​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Andersson%E2%80%99s%20Method%3A%20Author%20has%20proposed,apply%20the%20transformation%20rules%20to)

。
- **Davis & Aiken (2000)** – DavisとAikenはDBRE研究の歴史的発展を包括的に調査し、その成果と課題をまとめています​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=11,Ontologies%3A%20An%20Approach%20Based%20on)

。2000年のWCRE会議論文\*\*「Data Reverse Engineering: a historical survey」\*\*​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=11,on%20Conceptual%20Modeling)

では、1980年代から1990年代に提案された主要手法（例：リレーションスキーマからER図への変換手法や、コード解析を用いる手法）の比較検討を行い、入力情報の違いや自動化の度合いを評価しています。このようなサーベイ研究により、当時のDBRE手法の長所・短所や今後の研究課題（自動化の更なる向上など）が明らかにされています。

*//上記以外にも、HainautらのDB-MAIN​*

*[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=reverse%20engineering%20of%20relational%20databases%2C,Extracting%20Entity%20Relationship%20Diagram)*

*など多くのDBREツール/手法が存在しますが、紙幅の都合で代表的な例のみを挙げました。必要に応じて、他の文献（Hainaut 2003​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=7,on%20Software%20Maintenance%20and)

, Angyal et al. 2006​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Science%2C%20%282002%29%2052,516%2C%20Hungary%2C%20%282006)

など）も参照してください。//*

# SQLクエリ解析によるスキーマ推定

実行時の**SQLクエリログや問い合わせパターン**を分析することで、データベーススキーマの構造やリレーションを推定するアプローチも研究されています。静的なスキーマ情報だけでなく、実際に発行される`SELECT`や`JOIN`,`GROUP BY`といったクエリの傾向を利用することで、暗黙の外部キー関係や概念的な関連を発見できる利点があります​

[researchgate.net](https://www.researchgate.net/publication/221269387_Using_Queries_to_Improve_Database_Reverse_Engineering#:~:text=Original%20aspects%20of%20our%20method,a%20relationships%20and%20aggregates)

。主要な研究例を以下に示します。

- **Petit et al. (1994, ER国際会議)** – Petitらは**実行クエリの解析**をDBREに活用する手法を提案しました​

[researchgate.net](https://www.researchgate.net/publication/221269387_Using_Queries_to_Improve_Database_Reverse_Engineering#:~:text=Original%20aspects%20of%20our%20method,a%20relationships%20and%20aggregates)

。ER’94会議論文\*\*「Using Queries to Improve Database Reverse Engineering」**では、データベースのシステムカタログから得たリレーション定義に加え、**実行中の問い合わせの種類やパターンを分析**してEERスキーマ抽出を支援しています。特に、ある種のクエリが概念スキーマ上の**is-a関係（継承）**や**集約関係\*\*を示唆することを示し、クエリ分析によって従来検出が困難だった階層構造を推定しています​

[researchgate.net](https://www.researchgate.net/publication/221269387_Using_Queries_to_Improve_Database_Reverse_Engineering#:~:text=Original%20aspects%20of%20our%20method,a%20relationships%20and%20aggregates)

。著者らは具体的なSQL問い合わせ例に基づき、この手法でスキーマに包含関係を正しく組み込めることを実証しました。
- **Cleve et al. (2006, WCRE)** – Cleveらはソフトウェア中に埋め込まれたSQLを動的解析することでスキーマ情報を抽出するアプローチを発表しました​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Cleve%20and%20colleagues%20propose%20an,slices%20of%20a%20database%20system35)

​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=35,2006)

。**「Data Reverse Engineering using System Dependency Graphs」**​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=35,2006)

にて、アプリケーションのプログラムを解析し**システム依存グラフ**(SDG)を構築、データベースアクセスに関連するプログラムスライスを特定する手法を提案しています。これにより、コード中で頻出するテーブル間の結合条件やアクセスパターンを把握し、スキーマ上宣言されていない**暗黙の外部キー**や**ビジネスルール**を逆推定します。評価では、実在するデータ集中型アプリケーションに本手法を適用し、静的スキーマ情報だけでは得られないリレーションを復元できることを示しています。
- **その他のアプローチ** – クエリ解析によるスキーマ推定のアイデアは近年ではデータプロファイリングやデータ統合にも応用されています。例えば、ログ中のJOIN条件の出現頻度から外部キー候補を発見したり、`GROUP BY`や集計関数の利用からデータの多重度・階層構造を推測する手法が考えられます。学術文献として顕著な例は多くありませんが、実務では既存ツールがクエリログ分析を用いてリバースエンジニアリングを支援するケース（例：商用データモデリングツールの外部キー自動検出機能​

[hackolade.com](https://hackolade.com/help/Query-drivendatamodelingbasedona.html#:~:text=Query,unlearn%20the%20rules%20of%20normalization)

）もあります。これらはスキーマ設計の見直しやデータベース移行時の**制約復元**に有用です。

# 機械学習・NLPを用いたスキーマ推定

近年、テーブル名やカラム名といった**テキスト情報**に着目し、自然言語処理（NLP）や機械学習を活用してスキーマ構造を推定・補完する研究が注目されています。名前に含まれる単語や語幹のパターン、ドメイン知識を学習データとして用いることで、人手の設計意図をモデルが学習し、エンティティ間の関係や属性の意味を推測します。以下に関連する研究例を示します。

- **Santoso et al. (2010, *Knowledge-Based Systems*)** – Santosoらはリレーショナルデータベースから**オントロジーを抽出**する手法を提案しました​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=49,2002)

。**「Ontology extraction from relational database: concept hierarchy as background knowledge」**​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=49,2002)

にて、テーブル名・カラム名を分析し、あらかじめ用意した\*\*概念階層（例えば上位語・下位語の関係リスト）\*\*を背景知識として利用することで、データベースからオントロジーモデル（概念スキーマに類似）を自動生成しています。具体的には、名前の語彙を一般的な概念辞書と照合し、「顧客」「注文」などドメインを示す語句を検出してエンティティ候補とし、主外部キー関係や属性の集合をもとにクラス階層やリレーションを構築しました。評価では、実際の業務データベースを対象に、本手法で抽出したオントロジーがドメイン専門家の定義する概念階層と高い一致率を示すことが報告されています。
- **Mior & Ororbia (2019)** – Miorらはテーブル・カラム名から**分散表現（ベクトル埋め込み）**を学習し、スキーマ構造の類似性を捉える手法「*Column2Vec*」を開発しました​****

****[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=Column2Vec%3A%20Structural%20Understanding%20via%20Distributed,edu)****

****​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=in%20Section%203,example%2C%20approximately%20half%20of%20the)

。この研究ではオープンソースの多数のデータベーススキーマ（GitHub上のスキーマ約3万件）をコーパスとして、テーブル名とカラム名の共起情報から**単語ベクトル**を学習しています​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=in%20Section%204%20appear%20only,by%20looking%20at%20subword%20information)

。学習した埋め込みモデルにより、未知のテーブルに属するカラム名の集合からそのテーブルに相応しい名称を推測することが可能となります​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=take%20as%20input%20a%20list,of%20the%20word%20vectors%20associated)

​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=space,are%20considered%20for%20further%20evaluation)

。例えば、カラム名リスト「authorID, firstName, lastName, ISBN, title」に対しては「Authors」「Books」等の候補を高い精度で生成しうることを確認しています。評価では、学習データとは別のプロジェクトのスキーマに対しテーブル名を予測させ、実際の名称との類似度（WordNetによる語義の近さと精度・再現率のF値など）でモデル性能を測定し、分散表現によるスキーマ推定の有効性を示しました。
- **その他の機械学習応用** – スキーマ推定へのML/NLP応用は他にも、属性名の分類やスキーママッチングなど様々な形で研究されています。例えば、異なるデータベース間で**意味的に対応するカラムを機械学習でマッチング**する手法（スキーママッチング）では、カラム名やデータ型の特徴を組み合わせてベクトル化し、類似度に基づき対応付けを行います​

[mccormick.northwestern.edu](https://www.mccormick.northwestern.edu/computer-science/documents/nu-cs-2023-11.pdf#:~:text=Engineering%20www,to%20compute%20the%20match)

。この技術は企業合併時のデータ統合やオープンデータのメタデータ統合に応用されています。また、大規模言語モデルを用いて**データベーススキーマを理解・生成**する試みもあり、テーブル・カラム名をプロンプトとして与え適切な関係性を生成させる実験も行われています​

[arxiv.org](https://arxiv.org/html/2406.14545v2#:~:text=significant%20security%20vulnerabilities%2C%20particularly%20schema,99%20for%20generative%20models)

。これらは自然言語による問い合わせ（Text-to-SQL）システムの精度向上や、スキーマ設計支援ツールへの組み込みといった応用例が期待されています。

以上のように、リレーショナルデータベースのスキーマ推定に関する研究は、古典的なDBRE手法からクエリログ解析、さらに機械学習を用いた最新手法まで多岐にわたっています。それぞれのアプローチで利用可能な情報源（DDLのみ、DMLや実行ログ、名称テキストなど）が異なるため、目的や前提条件に応じて手法が使い分けられています。今後もデータベースリバースエンジニアリング分野と機械学習・NLP技術の融合により、より自動化された高精度なスキーマ推定が発展していくと考えられます。

**参考文献：**

- Premerlani W. J., Blaha M. R. (1993), *An Approach for Reverse Engineering of Relational Databases*, Proc. of Working Conf. on Reverse Engineering​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=37,183%2C%20%281997)

; and Premerlani W. J., Blaha M. R. (1994), *An Approach for Reverse Engineering of Relational Databases*, *Communications of the ACM* 37​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=38,1994)

.
- Chiang R., Barron T., Storey V. (1994), *Reverse engineering of relational databases: Extraction of an EER model from a relational database*, *Data & Knowledge Engineering*, pp.107–142​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=Cummings%2C%20%281992%29%205,1995)

.
- Andersson M. (1994), *Extracting an Entity-Relationship schema from a relational database through reverse engineering*, in **ER’94**, LNCS 881, pp.403–419​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=3,419%2C%20%281994)

.
- Petit J.-M., Kouloumdjian J., Boulicaut J.-F., Toumani F. (1994), *Using Queries to Improve Database Reverse Engineering*, in **ER’94**, LNCS 881​

[researchgate.net](https://www.researchgate.net/publication/221269387_Using_Queries_to_Improve_Database_Reverse_Engineering#:~:text=Original%20aspects%20of%20our%20method,a%20relationships%20and%20aggregates)

.
- Cleve A., Hénard J., Hainaut J.-L. (2006), *Data Reverse Engineering using System Dependency Graphs*, Proc. of 13th Working Conf. on Reverse Engineering, pp.157–166​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=35,2006)

.
- Santoso H. A., Haw S.-C., Mehdi Z. T. A. (2010), *Ontology extraction from relational database: Concept hierarchy as background knowledge*, *Knowledge-Based Systems* 24(3), pp.457–464​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=49,2002)

.
- Mior M. J., Ororbia A. G. (2019), *Column2Vec: Structural Understanding via Distributed Representations of Database Schemas*, arXiv:1903.08621​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=Column2Vec%3A%20Structural%20Understanding%20via%20Distributed,edu)

​

[arxiv.org](https://arxiv.org/pdf/1903.08621#:~:text=in%20Section%203,example%2C%20approximately%20half%20of%20the)

.
- その他、DBREとクエリ解析・機械学習に関する関連研究として、Davis K. & Aiken P. (2000)​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=11,on%20Conceptual%20Modeling)

、Johannesson P. (1994)​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=32%284%29%2C%20124%20,79%2C%20%282005)

、Yeh & Li (2005)​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=schemas%20into%20conceptual%20schemas%2C%20Proc,79%2C%20%282005)

、Alalfi et al. (2008)​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=47,191%2C%20%282008)

、Sousa et al. (2002)​

[isca.me](https://www.isca.me/rjrs/archive/v2/i5/10.ISCA-RJRS-2012-454.pdf#:~:text=50,2002)

など多数あり。必要に応じて参照してください。