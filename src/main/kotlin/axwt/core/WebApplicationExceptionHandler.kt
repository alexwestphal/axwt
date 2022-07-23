package axwt.core
import javax.ws.rs.WebApplicationException
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

class WebApplicationExceptionHandler: ExceptionMapper<WebApplicationException> {
    override fun toResponse(ex: WebApplicationException): Response =
        Response
            .status(ex.response.status)
            .header("Content-Type", "text/plain")
            .entity(ex.message)
            .build()

}