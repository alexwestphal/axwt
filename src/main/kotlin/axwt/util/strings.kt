package axwt.util

object strings {
    operator fun String.times(n: Int): String = buildString { for(i in 1..n) append(this@times) }

    fun String.padBoth(length: Int, padChar: Char = ' '): String {
        if(this.length >= length) return this
        val leftPadLength = (length - this.length) / 2
        val rightPadLength = length - this.length - leftPadLength
        return ("$padChar" * leftPadLength) + this + ("$padChar" * rightPadLength)
    }
}

