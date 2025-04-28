---
title: "ChatGPT"
source: "https://chatgpt.com/c/67cdd812-c658-8010-a194-34c557b07e9c"
author:
published:
created: 2025-03-31
description: "ChatGPT helps you get answers, find inspiration and be more productive. It is free to use and easy to try. Just ask and ChatGPT can help with writing, learning, brainstorming and more."
tags:
  - "clippings"
---
SQLクエリ解析＋機械学習（NLP）を組み合わせたDBスキーマ推定ツール開発について 動的検索（クエリや条件を追加する事に検索結果が徐々に変化していく）を考えていきたい スキーマ推定の動的検索として類似の先行研究を探してほしい

スキーマ推定の動的検索
1. 「動的検索」というのは、ユーザーがクエリや条件を順に追加していく過程で、その都度スキーマの構造推定結果が変化・補完されていくようなインタラクティブな推定プロセス



ユーザがクエリや条件を段階的に追加していくことでスキーマ推定がインクリメンタルに精緻化される手法について、近年いくつかの研究が報告されています。以下、関連する主な研究事例を年代順や手法の特徴ごとに紹介します。

## SQLクエリログに基づくスキーマ推定

- **OCEANプロジェクト / グラフベースのクエリログ分析 (Wahlら, 2018)** – Wahlらは、**「A graph-based framework for analyzing SQL query logs」** (GRADES-NDA 2018)にて、SQLクエリログをグラフモデルで解析するフレームワークを提案しました​
	[researchgate.net](https://www.researchgate.net/publication/325588162_A_graph-based_framework_for_analyzing_SQL_query_logs#:~:text=query%20log%20analysis%20with%20our,assemble%20a%20customized%20logmonitoring%20dashboard)
	。クエリログに含まれる**テーブル名や属性、結合関係**などの情報をノード・エッジからなるグラフにマッピングし、これを分析することで**データソース発見やスキーマ構造の把握**を支援します​
	[researchgate.net](https://www.researchgate.net/publication/325588162_A_graph-based_framework_for_analyzing_SQL_query_logs#:~:text=query%20log%20analysis%20with%20our,assemble%20a%20customized%20logmonitoring%20dashboard)
	。実際のデモでは、ログ中の関連クエリを探索・抽出したり、クエリの関係性グラフを可視化してダッシュボードを組み立てることで、**スキーマに含まれるテーブル間の関係推定**などに役立つことを示しています​
	[researchgate.net](https://www.researchgate.net/publication/325588162_A_graph-based_framework_for_analyzing_SQL_query_logs#:~:text=query%20log%20analysis%20with%20our,assemble%20a%20customized%20logmonitoring%20dashboard)
	。この研究は、**Open and Collaborative Query-Driven Analytics (OCEAN)** プロジェクトの一環で行われ、スキーマやデータ内容だけでは得られない**利用履歴に基づく知識**の発見を目的としています。
- **Pharos: Query-Driven Schema Inference (Haller & Lenz, 2020)** – 上記OCEANの発展として、HallerとLenzは\*\*「Pharos: Query-Driven Schema Inference for the Semantic Web」\*\* (Machine Learning and Knowledge Discovery in Databases 2020)を発表しました​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)
	。Pharosでは、**SQLクエリからスキーマの断片的知識を抽出**し、それらをRDFベースのナレッジグラフで表現する手法を提案しています​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)
	。具体的には、各SQLクエリ（SELECT文）は\*\*「部分的なスキーマ定義」**とみなせるとし、投影リスト中の属性やWHERE句での比較、JOIN句でのテーブル関係などからスキーマに関する知識を取り出します​
	[researchgate.net](https://www.researchgate.net/profile/David-Haller-2/publication/340245535_Pharos_Query-Driven_Schema_Inference_for_the_Semantic_Web/links/662f95d506ea3d0b74195050/Pharos-Query-Driven-Schema-Inference-for-the-Semantic-Web.pdf#:~:text=4,list%3B%20the%20use%20of%20type)
	。こうして得られた**部分スキーマ情報\*\*を知識グラフに統合し、データレイク上の異種データに対する概略的な概念スキーマを構築します​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)
	。Pharosの特徴はインクリメンタルなフィードバック機能であり、新たなクエリが実行されるたびに知識グラフを更新し、**分析者に対して対話的に部分スキーマ（データの意味的関係）をフィードバック**します​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)
	。著者らはJDBCプロキシドライバを用いてクエリログを非侵襲的に収集するプロトタイプを実装し、データアナリストがクエリをフォームする際に逐次的なスキーマ情報の提示で支援できることを示しました​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=demonstrated%20by%20a%20prototype%20implementation,with%20the%20formulation%20of%20queries)
	​
	[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)
	。このアプローチにより、**ユーザが持つ暗黙知やメンタルモデルをクエリ解析から形式知化**し、データ理解を支援することが可能となっています​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=The%20resulting%20knowledge%20graph%20describes,Human%20interpretation%20of%20the)
	​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=when%20the%20query%20log%20contains,with%20a%20different%20school%20grading)
	。

*(補足:* Pharosの後続研究として、Haller & Lenzは\*\*「Discovery of Ontologies from Implicit User Knowledge」\*\* (LWDA 2020)において、クエリ導出の知識グラフ上でオントロジー推定や論理推論を行う展望を示しています​

[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=The%20resulting%20knowledge%20graph%20describes,Human%20interpretation%20of%20the)

​

[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=when%20the%20query%20log%20contains,with%20a%20different%20school%20grading)

。クエリログから得られる知識は不完全かつ矛盾もありうるため、不確実性を許容した部分的オントロジーを構築し、自動推論で外れ値的なクエリや暗黙の前提を分析することを目指しています。このように**ユーザのクエリ履歴から段階的にデータソースの意味を近似する自己学習システム**の構想が語られており​

[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=results%20is%20required%20to%20gain,Therefore%2C%20the)

、クエリ追加による逐次的スキーマ推定の発展形と位置付けられます。)\*

## インタラクティブなクエリ操作による関係推定

- **Jim: Join Inference Machine (Bonifatiら, 2014)** – Bonifatiらの\*\*「Interactive Join Query Inference with JIM」\*\* (PVLDB 2014, demo)は、ユーザとの対話により結合クエリを推定するシステム[[**JIM**]]を紹介しています。ユーザは結合結果の一部となりうるタプル（レコードの組合せ）に対して「該当する/しない」のラベル付けを繰り返し行い、JIMはそのフィードバックに基づき**基底データ間の結合条件（キーとなる属性組）を推論**します​
	vldb.org
	​
	vldb.org
	。特徴的なのは、**事前にデータベースのリレーション間の整合性制約（外部キーなど）を仮定しない**点で、ユーザのラベル付けという最小限のヒントから任意のn項結合クエリを復元できることです​
	vldb.org
	。例えば複数のデータソースから旅行パッケージを組むケースで、ユーザは望む組合せに該当するタプルをいくつか正例・負例として示すだけで、システムが**該当する結合パス（結合するテーブル群と結合条件）**を絞り込んで提案します​
	vldb.org
	​
	vldb.org
	。JIMは各ラウンドで情報量の多い質問（タプル）を選んで提示する**アクティブ・ラーニング的手法**を用いており、交互作用を通じて迅速にユーザの意図するスキーマ上のリレーション（結合構造）を特定します​
	vldb.org
	。この技術は**スキーママッピング推論**（異種データ間の対応付け）への応用可能性も指摘されており、ユーザの操作履歴や例示からスキーマ関係を学習する一種のインタラクティブ手法です​
	vldb.org
	。
- **SnipSuggest (Khoussainovaら, 2010)** – ワシントン大学のKhoussainovaらは、**「SnipSuggest: Context-Aware Autocompletion for SQL」** (PVLDB 2010)にて、**過去のクエリログから学習したスニペット（部分問い合わせ）を利用したSQL自動補完**システムを提案しています​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=user%20types%20a%20query%2C%20SnipSuggest,valued%20functions%20in%20the%20FROM)
	。SnipSuggestは、ユーザがクエリをタイプしながら入力している**文脈（現在のFROM句やWHERE句の内容）**に応じて、ログ中の類似パターンから**次に追加すべきテーブル名や結合条件、集計関数等の候補**をリアルタイムに提示します​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=user%20types%20a%20query%2C%20SnipSuggest,valued%20functions%20in%20the%20FROM)
	​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=a%20log%20of%20past%20queries,from%20the%20Sloan%20Digital%20Sky)
	。例えば、FROM句にあるテーブルに基づいて**よく一緒に使われる別テーブルやビューを推薦**したり、WHERE句の条件に基づき**他の典型的な絞り込み条件を提案**するといった具合です​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=user%20types%20a%20query%2C%20SnipSuggest,to%20provide%20more%20accurate%20suggestions)
	​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=a%20log%20of%20past%20queries,queries.%20SnipSuggest%20adjusts%20its%20recommendations)
	。このシステムは**クエリ履歴に蓄積されたパターン**を活用しており、過去に頻出したテーブル間の組合せ（＝スキーマ上関連が深いテーブル）や典型的な条件を学習しているため、ユーザは部分的なクエリ入力だけで\*\*暗黙にスキーマ構造（テーブルの関連や重要な属性）\*\*を知ることができます​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=a%20log%20of%20past%20queries,from%20the%20Sloan%20Digital%20Sky)
	。実験では約94%の適合率で有用な候補を提案できたと報告されており​
	[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=able%20to%20provide%20more%20accurate,such%20as%20recommending%20popular%20snippets)
	、非エキスパートユーザが対話的にクエリを組み立てながらスキーマ理解を深める支援例といえます。
- **関係データベース可視化フレームワーク (杉渕・田中, 2007)** – 杉渕剛史・田中譲による研究​
	[proceedings-of-deim.github.io](https://proceedings-of-deim.github.io/DEIM2023/4b-7-3.pdf#:~:text=,918%E2%80%93932)
	は、日本語文献ですが\*\*「関係データベースモデルに基づくデータベース可視化フレームワークの提案と実装」**（電子情報通信学会論文誌D, 2007）として、データベースクエリの逐次的構築と可視化を統合したシステムを報告しています​
	[proceedings-of-deim.github.io](https://proceedings-of-deim.github.io/DEIM2023/4b-7-3.pdf#:~:text=%E6%9D%89%E6%B8%95%E3%82%89%E3%81%AF%EF%BC%8C%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%95%E3%83%AD%E3%83%BC%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E7%9B%B4%E6%84%9F%E7%9A%84%E3%81%8B%E3%81%A4%E6%AE%B5%E9%9A%8E%E7%9A%84%E3%81%AA%E3%82%AF%E3%82%A8%20%E3%83%AA%E3%81%8C%E6%A7%8B%E7%AF%89%E5%8F%AF%E8%83%BD%E3%81%AA%20GUI%20%E3%82%92%E6%A9%9F%E8%83%BD%E3%81%A8%E3%81%97%E3%81%A6%E5%82%99%E3%81%88%E3%81%9F%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%20%E3%82%AF%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F,%EF%BC%8E%E3%81%93%E3%82%8C%E3%82%89%E3%81%AE%E7%A0%94%E7%A9%B6%E3%81%AF%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%81%A8%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%20GUI%20%E4%B8%8A%20%E3%81%A7%E9%80%A3%E6%90%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%A7%EF%BC%8C%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%AA%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%82%92%E6%94%AF%E6%8F%B4%E3%81%99)
	。このフレームワークでは**「クエリフローモデル」**と呼ばれる手法を用い、GUI上でユーザが**直感的に段階的なクエリ構築**を行えるようにしています​
	[proceedings-of-deim.github.io](https://proceedings-of-deim.github.io/DEIM2023/4b-7-3.pdf#:~:text=%E6%9D%89%E6%B8%95%E3%82%89%E3%81%AF%EF%BC%8C%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%95%E3%83%AD%E3%83%BC%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E7%9B%B4%E6%84%9F%E7%9A%84%E3%81%8B%E3%81%A4%E6%AE%B5%E9%9A%8E%E7%9A%84%E3%81%AA%E3%82%AF%E3%82%A8%20%E3%83%AA%E3%81%8C%E6%A7%8B%E7%AF%89%E5%8F%AF%E8%83%BD%E3%81%AA%20GUI%20%E3%82%92%E6%A9%9F%E8%83%BD%E3%81%A8%E3%81%97%E3%81%A6%E5%82%99%E3%81%88%E3%81%9F%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%20%E3%82%AF%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F,%EF%BC%8E%E3%81%93%E3%82%8C%E3%82%89%E3%81%AE%E7%A0%94%E7%A9%B6%E3%81%AF%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%81%A8%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%20GUI%20%E4%B8%8A%20%E3%81%A7%E9%80%A3%E6%90%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%A7%EF%BC%8C%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%AA%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%82%92%E6%94%AF%E6%8F%B4%E3%81%99)
	。具体的には、テーブル同士をつないでいく操作でSQLライクな問合せを段階的に形成し、その都度中間結果を並列座標プロット（PCP）などで可視化することで、**データの結合関係や絞り込み条件の効果を確認しながら次の操作を選択**できます​
	[proceedings-of-deim.github.io](https://proceedings-of-deim.github.io/DEIM2023/4b-7-3.pdf#:~:text=%E6%9D%89%E6%B8%95%E3%82%89%E3%81%AF%EF%BC%8C%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%95%E3%83%AD%E3%83%BC%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E7%9B%B4%E6%84%9F%E7%9A%84%E3%81%8B%E3%81%A4%E6%AE%B5%E9%9A%8E%E7%9A%84%E3%81%AA%E3%82%AF%E3%82%A8%20%E3%83%AA%E3%81%8C%E6%A7%8B%E7%AF%89%E5%8F%AF%E8%83%BD%E3%81%AA%20GUI%20%E3%82%92%E6%A9%9F%E8%83%BD%E3%81%A8%E3%81%97%E3%81%A6%E5%82%99%E3%81%88%E3%81%9F%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%20%E3%82%AF%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F,%EF%BC%8E%E3%81%93%E3%82%8C%E3%82%89%E3%81%AE%E7%A0%94%E7%A9%B6%E3%81%AF%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%81%A8%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%20GUI%20%E4%B8%8A%20%E3%81%A7%E9%80%A3%E6%90%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%A7%EF%BC%8C%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%AA%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%82%92%E6%94%AF%E6%8F%B4%E3%81%99)
	。このように**クエリ構築プロセスとデータ構造の可視化を融合**することで、ユーザは探索的にデータ間の関係性（スキーマ構造上のつながり）を理解していくことが可能になります​
	[proceedings-of-deim.github.io](https://proceedings-of-deim.github.io/DEIM2023/4b-7-3.pdf#:~:text=%E6%9D%89%E6%B8%95%E3%82%89%E3%81%AF%EF%BC%8C%E3%82%AF%E3%82%A8%E3%83%AA%E3%83%95%E3%83%AD%E3%83%BC%E3%83%A2%E3%83%87%E3%83%AB%E3%81%AB%E3%82%88%E3%82%8B%E7%9B%B4%E6%84%9F%E7%9A%84%E3%81%8B%E3%81%A4%E6%AE%B5%E9%9A%8E%E7%9A%84%E3%81%AA%E3%82%AF%E3%82%A8%20%E3%83%AA%E3%81%8C%E6%A7%8B%E7%AF%89%E5%8F%AF%E8%83%BD%E3%81%AA%20GUI%20%E3%82%92%E6%A9%9F%E8%83%BD%E3%81%A8%E3%81%97%E3%81%A6%E5%82%99%E3%81%88%E3%81%9F%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%20%E3%82%AF%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%97%E3%81%9F,%EF%BC%8E%E3%81%93%E3%82%8C%E3%82%89%E3%81%AE%E7%A0%94%E7%A9%B6%E3%81%AF%EF%BC%8C%E5%8F%AF%E8%A6%96%E5%8C%96%E3%81%A8%E3%82%AF%E3%82%A8%E3%83%AA%E3%82%92%20GUI%20%E4%B8%8A%20%E3%81%A7%E9%80%A3%E6%90%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%81%93%E3%81%A8%E3%81%A7%EF%BC%8C%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%A9%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%AA%E3%83%87%E3%83%BC%E3%82%BF%E8%A7%A3%E6%9E%90%E3%82%92%E6%94%AF%E6%8F%B4%E3%81%99)
	。本研究は可視化支援が主眼ですが、「段階的なクエリ構築」というインタラクティブ手法により**スキーマ理解を徐々に深める\*\*点で今回のテーマと通ずるものがあります。

## データレイク・非構造データにおける構造学習

ユーザの逐次的操作によるものではありませんが、大量データから自動的にスキーマを推定する技術も近年発展しており、動的検索型のスキーマ推定と合わせて参考になります。

- **DATAMARAN: ログデータ集合からの構造抽出 (Gao, Huang, Parameswaran, 2018)** – UIUCのParameswaranらは、半構造化ログ（テキスト形式のイベントログ等）から**レコード構造を自動抽出**してリレーショナルな表に変換する手法**Datamaran**を提案しました​
	[arxiv.org](https://arxiv.org/abs/1708.08905#:~:text=%3E%20Abstract%3AOrganizations%20routinely%20accumulate%20semi,in%20order%20to%20efficiently%20extract)
	。**「Navigating the Data Lake with DATAMARAN: Automatically Extracting Structure from Log Datasets」** (SIGMOD 2018)では、コードの出力として蓄積されがちなログファイルを対象に、人手のスキーマ定義なしで**フィールド境界や繰り返しパターンを検出**し、複数の異なるレコード形式が混在する場合でもそれぞれの構造を見つけ出すアルゴリズムを示しています​
	[arxiv.org](https://arxiv.org/abs/1708.08905#:~:text=analyzed%20in%20conjunction%20with%20other,Datamaran%20can%20successfully%20extract%20structured)
	。Datamaranはクラスタリングや統計的手法を駆使してログ内の**区切りや書式の規則性を見いだし、高精度（95%程度）の構造抽出**に成功しています​
	[arxiv.org](https://arxiv.org/abs/1708.08905#:~:text=Datamaran%20automatically%20identifies%20field%20and,a%20substantial)
	。これはデータそのものからスキーマを推定する手法ですが、**データレイク内の未知データに対するスキーマ推定**という意味で、動的検索で段階的に構造を明らかにするアプローチと問題意識を共有しています（実際、Pharosの関連研究でもデータマイニング型のスキーマ推定例として引用されています​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Datatype,The)
	）。
- **JSONデータに対するスキーマ推定 (Baaziziら, 2017/2019)** – NoSQL文脈では、MongoDB等に代表されるJSONドキュメントから**スキーマ（フィールド構造）を推測**する研究があります。たとえば、Baaziziらによる一連の研究​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=2,Jan)
	​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Con%02ference%20on%20Extending%20Database%20Technology,Navigating%20the%20Data%20Lake%20with)
	では、大量のJSONデータ集合を解析し、キーの出現パターンや値の型情報にもとづいて\*\*「統計的に妥当なスキーマ定義」**を自動構築するアルゴリズムを提案しています。2017年のEDBT会議論文では巨大JSON集合からのスキーマ推定手法を示し​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=2,Jan)
	、さらに2019年のVLDB Journal論文では**パラメトリックなスキーマ推定\*\*（スキーマを木構造のパターン集合として表現）に発展させています​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Con%02ference%20on%20Extending%20Database%20Technology,Navigating%20the%20Data%20Lake%20with)
	。これらはバッチ処理によるデータプロファイリング型の推定ですが、スキーマが存在しない/不明な状況で**逐次的にデータ構造を明らかにしていく**上で有用な技術基盤と言えます。
- **その他の自動スキーマ推定・関連手法** – データベース統合やデータ検索の分野でもスキーマ推定に関連する技術が研究されています。たとえば**Metanome**​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Many%20approaches%20for%20schema%20inference,The)
	は種々のデータ profiling アルゴリズム（関数従属性の発見など）を統合したプラットフォームであり、これを用いてデータから主キー・外部キーを発見する研究​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Web,Jun%202019)
	や、列の値ドメインの類似性に基づき異なるデータセット間の属性対応を見つける研究​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Datatype,The)
	（Otaら, PVLDB 2020）もあります。Jiang & Naumann (2019)による**ホリスティックな主キー・外部キー検出**の研究​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Web,Jun%202019)
	では、リレーショナルDB内の全テーブルを俯瞰して、値の出現頻度やパターンから**キー候補の組合せ**を機械学習的に特定する手法を報告しています。さらに、データ統合システムにおける**インスタンスアシスト型のスキーママッピング**も動的構造学習に近い領域です。例えば**ESKAPEプラットフォーム**​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Datatype,10)
	​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=for%20Continuously%20Evolving%20Knowledge%20Graphs,2017)
	（2017年）は、ユーザがデータ中のインスタンス（値）を対話的に既知の概念に対応付けていくことで、徐々にデータのセマンティックスキーマ（意味モデル）を構築する環境を提供します。このような手法ではUI上で**ユーザが「この値はどのカテゴリに属するか」を指定**していくため、結果的に**データ項目と概念との対応（スキーマにおける意味的な位置づけ）**が段階的に明らかになります。知識グラフ構築の文脈ではPompら (2020) による**進化するナレッジグラフへの概念レコメンデーション**​
	[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=with%20metanome,ESKAPE%3A%20Information%20Platform)
	のように、新たなデータ到着時に適切なクラスやリレーションを提案する研究もあり、これも人間のフィードバックを介した逐次的スキーマ拡張とみなせるでしょう。

以上のように、**SQLクエリ解析＋機械学習を用いた逐次的スキーマ推定**に関連する研究は、クエリログ解析による部分スキーマの蓄積から、ユーザとの対話による関係推論、さらには非構造データからの自動スキーマ発見まで多岐にわたります。特に近年のPharos​

[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)

のような手法は、ユーザが検索・分析を進める中でシステム側も**段階的に学習・更新**される点で、まさに動的検索に対応したスキーマ推定と言えます。このようなアプローチにより、従来は暗黙知であったデータ構造の知識を可視化・補完し、インクリメンタルにデータ理解を深めることが可能になってきています。

**参考文献（代表例）**: Pharos​

[springerprofessional.de](https://www.springerprofessional.de/en/pharos-query-driven-schema-inference-for-the-semantic-web/17839460#:~:text=serve%20as%20the%20foundation%20for,with%20the%20formulation%20of%20queries)

, Wahlら (2018)​

[researchgate.net](https://www.researchgate.net/publication/325588162_A_graph-based_framework_for_analyzing_SQL_query_logs#:~:text=query%20log%20analysis%20with%20our,assemble%20a%20customized%20logmonitoring%20dashboard)

, Bonifatiら (2014)​

vldb.org

, Khoussainovaら (2010)​

[vldb.org](https://www.vldb.org/pvldb/vol4/p22-khoussainova.pdf#:~:text=user%20types%20a%20query%2C%20SnipSuggest,valued%20functions%20in%20the%20FROM)

, Gaoら (2018)​

[arxiv.org](https://arxiv.org/abs/1708.08905#:~:text=analyzed%20in%20conjunction%20with%20other,Datamaran%20can%20successfully%20extract%20structured)

, Baaziziら (2017,2019)​

[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=2,Jan)

​

[ceur-ws.org](https://ceur-ws.org/Vol-2738/LWDA2020_paper_4.pdf#:~:text=Con%02ference%20on%20Extending%20Database%20Technology,Navigating%20the%20Data%20Lake%20with)

など。各々が本テーマに関連する技術要素（インタラクティブ性、機械学習活用、データ駆動型推定など）を提供しています。