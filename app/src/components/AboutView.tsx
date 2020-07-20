import React from 'react';

const AboutView: React.FC<React.Props<any>> = _ => {
    return (
        <div className="content">
            <h2 className="title is-4">湯花草子について</h2>
            <div className="section">
                準備中
            </div>
            <div className="section">
                <h3 className="title is-5">お問い合わせ</h3>
                fujii@xaxxi.net までお願いします。
            </div>
            <div className="section">
                <h3 className="title is-5">関連ページ</h3>
                <dl>
                    <dt><a href="https://fontopo.com/">fontopo</a></dt>
                    <dd>
                        ロゴフォントには fontopo 様で配布されている
                        <a href="https://fontopo.com/?p=377">はれのそら明朝</a>
                        を利用しました。
                    </dd>
                    <dt><a href="https://fontawesome.com">Font Awesome</a></dt>
                    <dd>
                        Webページ内の各種アイコンは Font Awesome を利用しました。
                    </dd>
                    <dt><a href="https://bulma.io/">Bulma</a></dt>
                    <dd>
                        Webページデザイン、レイアウトには、
                        CSSフレームワークの Bulma を利用しました。
                    </dd>
                    <dt><a href="https://github.com/kikei/composition-of-onsen">kikei/composition-of-onsen</a></dt>
                    <dd>
                        Webクライアント側アプリケーションはオープンソースで開発しています。
                    </dd>
                    <dt><a href="https://github.com/kikei/composion-of-onsen-server">kikei/composion-of-onsen-server</a></dt>
                    <dd>
                        サーバー側もオープンソースで開発しています。
                    </dd>
                </dl>
            </div>
        </div>
    )
}

export default AboutView;
