import { AwardIcon, BookOpenCheckIcon, CheckCircle2Icon, RotateCcwIcon } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  let [index, setIndex] = useState(0)
  let [selected, setSelected] = useState<number | null>(null)
  let [score, setScore] = useState(0)
  let [answered, setAnswered] = useState<Record<number, boolean>>({})

  let quiz = Quizzes[index]
  let isCorrect = selected === quiz.answer
  let progress = Math.round(((index + 1) / Quizzes.length) * 100)

  function choose(option: number) {
    if (selected !== null) return

    setSelected(option)

    if (option === quiz.answer && !answered[index]) {
      setScore(score + 1)
      setAnswered({ ...answered, [index]: true })
    }
  }

  function next() {
    setIndex((index + 1) % Quizzes.length)
    setSelected(null)
  }

  function reset() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setAnswered({})
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-stone-950">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-md bg-emerald-700 text-white">
              <BookOpenCheckIcon className="size-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                情報 2 講義ノート対策
              </p>
              <h1 className="text-2xl font-bold tracking-normal sm:text-3xl">
                先生が出しそうな確認クイズ
              </h1>
            </div>
          </div>

          <div className="stats w-full border border-stone-200 bg-stone-50 shadow-none sm:w-auto">
            <div className="stat min-w-32">
              <div className="stat-title text-stone-500">正解数</div>
              <div className="stat-value text-2xl text-emerald-700">
                {score}
              </div>
            </div>
            <div className="stat min-w-32">
              <div className="stat-title text-stone-500">問題数</div>
              <div className="stat-value text-2xl">{Quizzes.length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-md border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="badge bg-emerald-100 text-emerald-900">
                第{quiz.lesson}回
              </span>
              <span className="badge border-stone-300 bg-white text-stone-700">
                {quiz.topic}
              </span>
              <span className="text-sm text-stone-500">
                {index + 1} / {Quizzes.length}
              </span>
            </div>
            <progress
              className="progress progress-success h-2 w-full"
              value={progress}
              max="100"
            ></progress>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <p className="text-lg leading-8 sm:text-xl">{quiz.question}</p>

            <div className="grid gap-3">
              {quiz.options.map((option, optionIndex) => (
                <button
                  key={option}
                  type="button"
                  className={getOptionClass(optionIndex, selected, quiz.answer)}
                  onClick={() => choose(optionIndex)}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded bg-white text-sm font-bold text-stone-700">
                    {OptionLabels[optionIndex]}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {selected !== null && (
              <Feedback quiz={quiz} isCorrect={isCorrect} />
            )}

            <div className="flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                className="btn border-stone-300 bg-white text-stone-800 hover:bg-stone-100"
                onClick={reset}
              >
                <RotateCcwIcon className="size-4" />
                最初から
              </button>
              <button
                type="button"
                className="btn bg-emerald-700 text-white hover:bg-emerald-800"
                onClick={next}
                disabled={selected === null}
              >
                次の問題へ
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-bold">出題範囲</h2>
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
              {Quizzes.map((item, quizIndex) => (
                <button
                  key={`${item.lesson}-${item.topic}-${quizIndex}`}
                  type="button"
                  className={getNavClass(quizIndex, index, answered)}
                  onClick={() => {
                    setIndex(quizIndex)
                    setSelected(null)
                  }}
                  title={`第${item.lesson}回 ${item.topic}`}
                >
                  {quizIndex + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-stone-200 bg-emerald-50 p-5 text-emerald-950">
            <AwardIcon className="mb-3 size-8 text-emerald-700" />
            <p className="font-bold">狙いどころ</p>
            <p className="mt-2 text-sm leading-6">
              講義ノートの確認問題、重要見出し、ITパスポート風の聞き方を混ぜています。
              まずは正解の理由まで言える状態を目指しましょう。
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Feedback({ quiz, isCorrect }: FeedbackProps) {
  if (isCorrect) {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
        <div className="flex items-start gap-3">
          <CheckCircle2Icon className="mt-1 size-6 shrink-0 text-emerald-700" />
          <div>
            <p className="font-bold">{quiz.praise}</p>
            <p className="mt-2 text-sm leading-6">{quiz.explain}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-5 text-amber-950">
      <p className="font-bold">惜しいです。ここは先生がひっかけやすいところ。</p>
      <p className="mt-2 text-sm leading-6">{quiz.hint}</p>
    </div>
  )
}

function getOptionClass(option: number, selected: number | null, answer: number) {
  let base =
    'flex min-h-14 w-full items-center gap-3 rounded-md border px-4 py-3 text-left transition'

  if (selected === null) {
    return `${base} border-stone-200 bg-stone-50 hover:border-emerald-500 hover:bg-emerald-50`
  }

  if (option === answer) {
    return `${base} border-emerald-500 bg-emerald-100 text-emerald-950`
  }

  if (option === selected) {
    return `${base} border-rose-300 bg-rose-50 text-rose-950`
  }

  return `${base} border-stone-200 bg-stone-50 opacity-60`
}

function getNavClass(
  quizIndex: number,
  index: number,
  answered: Record<number, boolean>,
) {
  let base = 'btn btn-sm h-10 min-h-10 rounded-md border'

  if (quizIndex === index) {
    return `${base} border-emerald-700 bg-emerald-700 text-white`
  }

  if (answered[quizIndex]) {
    return `${base} border-emerald-200 bg-emerald-100 text-emerald-900`
  }

  return `${base} border-stone-200 bg-white text-stone-700 hover:bg-stone-100`
}

const OptionLabels = ['ア', 'イ', 'ウ', 'エ']

const Quizzes: Quiz[] = [
  {
    lesson: '01',
    topic: '学修単位',
    question:
      '情報2は2単位の学修単位科目です。半期全体で求められる授業時間外学習はどれですか。',
    options: ['15時間', '30時間', '60時間', '90時間'],
    answer: 2,
    praise: '正解！授業の重さをちゃんと読めています。',
    explain:
      '講義ノートでは、対面授業30時間相当に加えて、授業時間外学習60時間相当が必要とされています。',
    hint: '1回90分の授業だけで届く設計ではなく、週4時間の自学が前提です。',
  },
  {
    lesson: '01',
    topic: 'ITパスポート',
    question:
      'ITパスポート試験の形式として、講義ノートの説明に合うものはどれですか。',
    options: [
      '90分で50問、記述式',
      '120分で100問、4肢択一',
      '60分で100問、穴埋め式',
      '120分で50問、実技式',
    ],
    answer: 1,
    praise: '正解！試験の基本条件はばっちりです。',
    explain:
      'ITパスポートはCBT形式で、120分間に100問、すべて4肢択一として説明されています。',
    hint: 'CBT形式、100問、4肢択一というセットで覚えると強いです。',
  },
  {
    lesson: '02',
    topic: '5大装置',
    question:
      'CPUがコンピュータ5大装置の中で主に兼ねている2つの装置はどれですか。',
    options: [
      '入力装置と出力装置',
      '演算装置と制御装置',
      '主記憶装置と補助記憶装置',
      '通信装置と出力装置',
    ],
    answer: 1,
    praise: '正解！CPUの役割をきれいに押さえています。',
    explain:
      '講義ノートでは、CPUは5大装置のうち演算装置と制御装置を兼ねるデバイスとして扱われています。',
    hint: 'CPUは計算するだけでなく、命令を取り出して全体の動作も制御します。',
  },
  {
    lesson: '03',
    topic: 'データ表現',
    question:
      '1バイトは何ビットとして扱われますか。',
    options: ['2ビット', '4ビット', '8ビット', '16ビット'],
    answer: 2,
    praise: '正解！2進数まわりの土台が固まっています。',
    explain:
      '2進数、ビット、バイトの関係はデジタルデータ表現の基本です。1バイトは8ビットです。',
    hint: '画像の8bit階調やASCII文字の説明にもつながる基本単位です。',
  },
  {
    lesson: '04',
    topic: 'Microsoft Forms',
    question:
      'Microsoft Formsで「複数回答」を無効にした選択肢の設問は、回答者側では主にどの形式として機能しますか。',
    options: [
      'ラジオボタン',
      'チェックボックス',
      'ファイルアップロード',
      '改行付きテキスト',
    ],
    answer: 0,
    praise: '正解！フォーム作成者の視点で理解できています。',
    explain:
      '講義ノートでは、選択肢設問で複数回答を無効にするとラジオボタン、有効にするとチェックボックスとして機能すると説明されています。',
    hint: '1つだけ選ばせたいのか、複数選ばせたいのかでUIが変わります。',
  },
  {
    lesson: '05',
    topic: 'Windowsのパス',
    question:
      '一般的なWindows PCで、OSがインストールされているストレージデバイスのドライブレターはどれですか。',
    options: ['A', 'B', 'C', 'D'],
    answer: 2,
    praise: '正解！ファイル操作の基本は抜かりなしです。',
    explain:
      '講義ノートの確認問題では、一般的なWindows PCのOSインストールドライブはCドライブとされています。',
    hint: 'AやBは昔のフロッピーディスク由来として扱われることがあります。',
  },
  {
    lesson: '05',
    topic: '絶対パス',
    question:
      'C:\\Users\\xxxx\\Documents\\Data を開いているとき、親フォルダの絶対パスはどれですか。',
    options: [
      'C:\\Users\\xxxx',
      'C:\\Users\\xxxx\\Documents',
      'C:\\Users\\xxxx\\Documents\\Data',
      'C:\\Users\\xxxx\\Documents\\Data\\backup',
    ],
    answer: 1,
    praise: '正解！階層を一段戻る感覚ができています。',
    explain:
      '親フォルダは現在のフォルダの1つ上です。Dataの1つ上はDocumentsになります。',
    hint: '最後のフォルダ名を1つ取り除く、と考えると整理しやすいです。',
  },
  {
    lesson: '06',
    topic: 'RGB画像',
    question:
      'RGBカラー画像で、赤色を16進数カラーコードで表すとどれですか。',
    options: ['#00FF00', '#0000FF', '#FF0000', '#FFFFFF'],
    answer: 2,
    praise: '正解！RGBの並びも16進数も見えています。',
    explain:
      '講義ノートでは、赤色(255, 0, 0)は#FF0000、黄色(255, 255, 0)は#FFFF00と説明されています。',
    hint: 'カラーコードは#RRGGBBの順です。赤だけ最大ならFF0000です。',
  },
  {
    lesson: '06',
    topic: 'グレースケール',
    question:
      'RGB画像をグレースケール画像に変換すると、データ量はRGBカラー画像の約何分の1になりますか。',
    options: ['1/2', '1/3', '1/8', '1/24'],
    answer: 1,
    praise: '正解！画像処理でグレースケール化する理由まで掴めています。',
    explain:
      'RGBは1画素あたり24bit、グレースケールは8bitなので、データ量はおよそ1/3になります。',
    hint: 'RGBはR、G、Bの3成分。グレースケールは明るさ1成分です。',
  },
  {
    lesson: '06',
    topic: '二値化',
    question:
      '単純二値化処理の説明として最も適切なものはどれですか。',
    options: [
      '画素値をすべて255から引く処理',
      'RGBの3成分を入れ替える処理',
      'しきい値以上か未満かで白黒に分ける処理',
      '画像の縦横サイズを半分にする処理',
    ],
    answer: 2,
    praise: '正解！白黒画像への変換の本質を押さえています。',
    explain:
      '二値化は、しきい値を基準に対象物と背景などを分け、測定や認識をしやすくする前処理です。',
    hint: '講義ノートでは、150未満は0、150以上は255という例が出ています。',
  },
  {
    lesson: '07',
    topic: 'LAN',
    question:
      'ICT分野におけるLANは、何の略ですか。',
    options: [
      'Local Area Network',
      'Large Access Node',
      'Logical Address Number',
      'Linked Application Network',
    ],
    answer: 0,
    praise: '正解！ネットワーク用語の足場がいい感じです。',
    explain:
      'LANはLocal Area Networkの略で、学校内や会社内など小規模な範囲のネットワークを指します。',
    hint: 'WANはWide Area Network。LANとの対比で覚えると楽です。',
  },
  {
    lesson: '07',
    topic: 'IPアドレス',
    question:
      'IPv4アドレスとIPv6アドレスのビット数の組み合わせとして正しいものはどれですか。',
    options: ['IPv4は16bit、IPv6は64bit', 'IPv4は32bit、IPv6は128bit', 'IPv4は64bit、IPv6は128bit', 'IPv4は128bit、IPv6は256bit'],
    answer: 1,
    praise: '正解！IPv4とIPv6の違いを数字で言えています。',
    explain:
      '講義ノートの確認問題では、IPv4は32ビット、IPv6は128ビットとされています。',
    hint: 'IPv4の10進表記は0から255までの数値を4つ並べます。',
  },
  {
    lesson: '07',
    topic: 'DNS',
    question:
      'DNSの主な機能として最も適切なものはどれですか。',
    options: [
      'ネットワーク接続のユーザー認証をする',
      'ドメイン名とIPアドレスを対応付ける',
      'LANケーブルの断線を検出する',
      '画像を白黒に変換する',
    ],
    answer: 1,
    praise: '正解！Webアクセスの裏側が見えています。',
    explain:
      'DNSは、ドメイン名とIPアドレスを対応付ける仕組みとして説明されています。',
    hint: '人間に読みやすい名前を、通信に必要な住所へつなぐ役割です。',
  },
  {
    lesson: '09',
    topic: '共通鍵暗号',
    question:
      '暗号化と復号化の処理が相対的に高速なのはどちらですか。',
    options: ['公開鍵暗号方式', '共通鍵暗号方式', 'デジタル署名', 'ハッシュ関数'],
    answer: 1,
    praise: '正解！暗号方式の使い分けが見えてきています。',
    explain:
      '共通鍵暗号方式は、公開鍵暗号方式と比べて高速に暗号化と復号化ができると説明されています。',
    hint: '大量データの暗号化に向く方式として覚えると整理できます。',
  },
  {
    lesson: '09',
    topic: '公開鍵暗号',
    question:
      '情報の秘匿を目的として、Yさんに電子メールを暗号化して送りたい。使用する鍵はどれですか。',
    options: ['Xさんの公開鍵', 'Xさんの秘密鍵', 'Yさんの公開鍵', 'Yさんの秘密鍵'],
    answer: 2,
    praise: '正解！公開鍵暗号の向きがかなり大事、そこを取れています。',
    explain:
      '相手だけが復号できるようにするため、受信者であるYさんの公開鍵で暗号化します。',
    hint: '秘密にしたい情報は、受け取る相手の公開鍵で閉じ込めます。',
  },
  {
    lesson: '09',
    topic: 'ハッシュ値',
    question:
      'デジタル署名などに用いるハッシュ関数の特徴として適切なものはどれですか。',
    options: [
      'ハッシュ値から元のメッセージを簡単に復元できる',
      '異なるメッセージでも必ず同じハッシュ値になる',
      'メッセージが1ビット違っても出力が変わり得る',
      'ハッシュ値は入力データより必ず長くなる',
    ],
    answer: 2,
    praise: '正解！改ざん検知につながる性質を押さえています。',
    explain:
      'ハッシュ値は固定長で、入力が少しでも違うと値が大きく変わるため、改ざん検知などに使えます。',
    hint: 'メッセージダイジェストとも呼ばれます。復元ではなく検知に強い道具です。',
  },
]

type Quiz = {
  lesson: string
  topic: string
  question: string
  options: string[]
  answer: number
  praise: string
  explain: string
  hint: string
}

type FeedbackProps = {
  quiz: Quiz
  isCorrect: boolean
}
