import React from 'react';
import ExternalLink from './ExternalLink';

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
                    <dt>
                        <ExternalLink href="https://fontopo.com/">
                            fontopo
                        </ExternalLink>
                    </dt>
                    <dd>
                        ロゴフォントには fontopo 様で配布されている
                        <ExternalLink href="https://fontopo.com/?p=377">
                            はれのそら明朝
                        </ExternalLink>
                        を利用しました。
                    </dd>
                    <dt>
                        <ExternalLink href="https://fontawesome.com">
                            Font Awesome
                        </ExternalLink>
                    </dt>
                    <dd>
                        Webページ内の各種アイコンは Font Awesome を利用しました。
                    </dd>
                    <dt>
                        <ExternalLink href="https://bulma.io/">
                            Bulma
                        </ExternalLink>
                    </dt>
                    <dd>
                        Webページデザイン、レイアウトには、
                        CSSフレームワークの Bulma を利用しました。
                    </dd>
                    <dt>
                        <ExternalLink href="https://geenes.app/">
                            Geenes
                        </ExternalLink>
                    </dt>
                    <dd>
                        ベースカラーは Geenes で生成しました。
                    </dd>
                    <dt>
                        <ExternalLink href="https://github.com/kikei/composition-of-onsen">
                            kikei/composition-of-onsen
                        </ExternalLink>
                    </dt>
                    <dd>
                        Webクライアント側アプリケーションはオープンソースで開発しています。
                    </dd>
                    <dt>
                        <ExternalLink href="https://github.com/kikei/composion-of-onsen-server">
                            kikei/composion-of-onsen-server
                        </ExternalLink>
                    </dt>
                    <dd>
                        サーバー側もオープンソースで開発しています。
                    </dd>
                </dl>
            </div>
        </div>
    )
}

export default AboutView;
