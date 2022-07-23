package axwt.core

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import javax.ws.rs.ext.ContextResolver

object AXWTObjectMapper: ObjectMapper() {
    init {
        registerModule(KotlinModule.Builder().build())
        registerModule(JavaTimeModule())
        enable(SerializationFeature.INDENT_OUTPUT)
        disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
        disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    }

    class Resolver: ContextResolver<ObjectMapper> {
        override fun getContext(p0: Class<*>?): ObjectMapper {
            return AXWTObjectMapper
        }
    }
}