package axwt.core

import org.slf4j.LoggerFactory
import javax.servlet.Filter
import javax.servlet.FilterChain
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import javax.servlet.annotation.WebFilter
import javax.servlet.http.HttpServletRequest

@WebFilter("/*")
class RequestFilter: Filter {
    val logger = LoggerFactory.getLogger(this::class.java)

    override fun doFilter(request: ServletRequest, response: ServletResponse, filterChain: FilterChain) {
        val servletPath = (request as HttpServletRequest).servletPath

        if(servletPath.startsWith("/api") || servletPath.startsWith("/js")) filterChain.doFilter(request, response)
        else {
            response.contentType = "text/html"
            response.writer.use { pw ->
                pw.write(IndexHTML.html.value)
                pw.flush()
            }
        }
    }
}

object IndexHTML {
    val logger = LoggerFactory.getLogger("IndexHTML")

    val html = lazy {
        val scriptDir = if(AppOpt.DevFrontend in ApplicationOptions) "http://localhost:9000" else "/axwt/js"

        //language=HTML
        """
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>AXWT</title>
                    <script defer src="$scriptDir/axwt-core.bundle.js"></script>
                </head>
                <body></body>
            </html>
        """.trimIndent()
    }
}
