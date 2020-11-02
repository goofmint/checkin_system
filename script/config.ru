class TestScript
  PATH = "connpass.rb"
  CODE = File.read(PATH)
  # デバッグするスクリプトを読み込む
  eval(CODE, binding, fname=PATH)
end

# 読み込んだスクリプトをハンドラーとして定義
map("/") do
  run TestScript.new
end
